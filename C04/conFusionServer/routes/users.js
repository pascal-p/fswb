let express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');

let User = require('../models/user');

router.use(bodyParser.json());


/* GET users listing. */
router.get('/', function(req, resp, _next) {
  resp.send('respond with a resource');
});

router.post('/signup', (req, resp, next) => {
  User.findOne({username: req.body.username})
    .then((user) => {
      if (user) { // truthy
        let err = new Error('User ' + req.body.username + ' already exists!');
        err.status = 403;
        next(err);
      }
      else {
        return User.create({
          username: req.body.username,
          password: req.body.password
        });
      }
    })
    .then((user) => {
      resp.statusCode = 200;
      resp.setHeader('Content-Type', 'application/json');
      resp.json({status: 'Registration Successful!', user: user});
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/login', (req, resp, next) => {
  if(!req.session.user) { // falsey
    let authHeader = req.headers.authorization;

    if (!authHeader) {
      let err = new Error('You are not authenticated!');
      resp.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    let [username, password] = auth;

    User.findOne({username: username})
      .then((user) => {
        if (!user) { // user === null
          let err = new Error('User ' + username + ' does not exist!');
          err.status = 403;
          return next(err);
        }
        else if (user.password !== password) {
          let err = new Error('Your password is incorrect!');
          err.status = 403;
          return next(err);
        }
        else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          resp.statusCode = 200;
          resp.setHeader('Content-Type', 'text/plain');
          resp.end('You are authenticated!')
        }
      })
      .catch((err) => next(err));
  }
  else {
    resp.statusCode = 200;
    resp.setHeader('Content-Type', 'text/plain');
    resp.end('You are already authenticated!');
  }
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
