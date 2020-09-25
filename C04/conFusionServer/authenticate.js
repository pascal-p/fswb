let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

let GitHubStrategy = require('passport-github').Strategy;

let config = require('./config.js');

let User = require('./models/user');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
  return jwt.sign(user,
                  config.secretKey,
                  {expiresIn: 3600});   // 1 hour before expiration
};

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(
  opts,
  (jwt_payload, done) => {
    console.log("DEBUG: JWT payload: ", jwt_payload);

    User.findOne({_id: jwt_payload._id}, (err, user) => {
      if (err) {
        return done(err, false);
      }
      else if (user) {
        return done(null, user);
      }
      else {
        return done(null, false);
      }
    });
  }));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, _resp, next) => {
  if (req.user.admin) {
    console.log("DEBUG: Admin Access detected...");
    next();
  }
  else {
    let err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    next(err);
  }
}

exports.githubPassport = passport.use(
  new GitHubStrategy(
    {
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.siteUrlCB
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
          return cb(err, false);
        }
        if (!err && user) { // user !== null
          return cb(null, user);
        }
        else {
          // user does not exist yet...
          console.log("DEBUG: github profile is: ", profile)

          // assuming profile has these properties!
          user = new User({ username: profile.displayName });

          user.githubId = profile.id;
          user.firstname = profile.name;
          user.lastname = ''; // no lastname with github

          user.save((err, user) => (err) ? cb(err, false) : cb(null, user));
        }
      })
    })
);
