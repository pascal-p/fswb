let express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
let passport = require('passport');

let User = require('../models/user');

const ctype = 'application/json';
router.use(bodyParser.json());


/* GET users listing. */
router.get('/', function(req, resp, _next) {
  resp.send('respond with a resource');
});

router.post('/signup', (req, resp, next) => {
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    (err, _user) => {
      if (err) {
        resp.statusCode = 500;
        resp.setHeader('Content-Type', ctype);
        resp.json({err: err});
      }
      else {
        passport.authenticate('local')(req, resp, () => {
          resp.statusCode = 200;
          resp.setHeader('Content-Type', ctype);
          resp.json({success: true, status: 'Registration Successful!'});
        });
      }
    });
});

router.post('/login', passport.authenticate('local'), (_req, resp) => {
  resp.statusCode = 200;
  resp.setHeader('Content-Type', ctype);
  resp.json({success: true, status: 'You are successfully logged in!'});
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
