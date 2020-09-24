let express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
let passport = require('passport');
let authenticate = require('../authenticate');

let User = require('../models/user');

const ctype = 'application/json';
router.use(bodyParser.json());


const setError = (resp, err, msg="") => {
  resp.statusCode = 500;
  resp.setHeader('Content-Type', ctype);
  resp.json({err: err, msg: msg});
}

/* GET users listing. */
router.get(
  '/',
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

router.post('/signup', (req, resp, next) => {
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

router.post('/login', passport.authenticate('local'), (req, resp) => {
  const token = authenticate.getToken({_id: req.user._id});
  resp.statusCode = 200;
  resp.setHeader('Content-Type', ctype);
  resp.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, resp) => {
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
