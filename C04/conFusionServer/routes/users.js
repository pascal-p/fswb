let express = require('express');
const bodyParser = require('body-parser');
let passport = require('passport');

const cors = require('./cors');
let authenticate = require('../authenticate');
let User = require('../models/user');

let router = express.Router();

const ctype = 'application/json';
router.use(bodyParser.json());


const setError = (resp, err, msg="") => {
  resp.statusCode = 500;
  resp.setHeader('Content-Type', ctype);
  resp.json({err: err, msg: msg});
}


router.options('*', cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })

/* GET users listing. */
router.get(
  '/',
  cors.cors,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, resp, next) => {
    User.find()
      .then((users) => {
        resp.statusCode = 200;
        resp.json(users);
      }, (err) => next(err))
      .catch((err) => next(err));
});

router.post('/signup',
            cors.corsWithOptions,
            (req, resp, next) => {
  console.log("DEBUG: received payload: ", req.body);

  User.register(
    new User({username: req.body.username}),
    req.body.password,
    (err, user) => {
      if (err) {
        setError(resp, err, "Error type 1");
      }
      else {
        if (req.body.firstname)
          user.firstname = req.body.firstname;

        if (req.body.lastname)
          user.lastname = req.body.lastname;

        user.save((err, user) => {
          if (err) {
            setError(resp, err, "Error type 2 - when saving...");
            return;
          }

          passport.authenticate('local')(req, resp, () => {
            resp.statusCode = 200;
            resp.setHeader('Content-Type', ctype);
            resp.json({success: true, status: 'Registration Successful!'});
          });
        });
      }
    });
});

router.post('/login',
            cors.corsWithOptions,
            (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      resp.statusCode = 401;
      resp.setHeader('Content-Type', ctype);
      resp.json({success: false, status: 'Login Unsuccessful!', err: info});
    }

    req.logIn(user, (err) => {
      if (err) {
        resp.statusCode = 401;
        resp.setHeader('Content-Type', ctype);
        resp.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});
      }

      const token = authenticate.getToken({_id: req.user._id});
      resp.statusCode = 200;
      resp.setHeader('Content-Type', ctype);
      resp.json({success: true, status: 'Login Successful!', token: token});
    });
  })(req, resp, next);
});

router.get('/checkJWTtoken',
           cors.corsWithOptions, (req, resp, next) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      resp.statusCode = 401;
      resp.setHeader('Content-Type', ctype);
      return resp.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      resp.statusCode = 200;
      resp.setHeader('Content-Type', ctype);
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  })(req, resp);
});

//
// github oauth
//
router.get('/github/token',
           passport.authenticate('github'),
           (req, resp) => {   // or is it 'github-token'?
  if (req.user) {
    let token = authenticate.getToken({_id: req.user._id});
    resp.statusCode = 200;
    resp.setHeader('Content-Type', ctype);
    resp.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

router.get('/github/callback',
        passport.authenticate('github',
                              { failureRedirect: '/login' }),
        (req, resp) => {
          console.log(" Github return here... ")
          // Successful authentication, redirect home.
          resp.redirect('/');
        }
);

router.get('/logout',
           cors.corsWithOptions,
           (req, resp, next) => {
  if (req.session) {
    req.session.destroy();
    resp.clearCookie('session-id');

    resp.redirect('/');
  }
  else {
    let err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = router;
