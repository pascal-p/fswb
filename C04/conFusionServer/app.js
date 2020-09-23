let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let FileStore = require('session-file-store')(session);


const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url,
                                 { useUnifiedTopology: true,
                                   useFindAndModify: false,  // https://mongoosejs.com/docs/deprecations.html#findandmodify
                                   useNewUrlParser: true });

const notAuthErr = new Error('You are not authenticated');
const authHeader = ['WWW-Authenticate', 'Basic'];

const setError = (resp) => {
  let err = notAuthErr;
  resp.setHeader(...authHeader);
  err.status = 401;
  return err;
}

const auth = (req, resp, next) => {
  console.log("DEBUG1 request headers: ", req.headers);
  console.log("DEBUG2 request session: ", req.session);

  if (!req.session.user) {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
      let err = setError(resp);
      next(err);
      return;
    }

    let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    let [user, pass] = auth;

    if (user === 'admin' && pass === 'pass-8421') {
      console.log('DEBUG: authorized');
      req.session.user = 'admin';
      next(); // authorized
    }
    else {
      let err = setError(resp);
      console.log('DEBUG: NOT authorized');
      next(err);
    }
  }
  else {
    if (req.session.user === 'admin') {
      console.log("DEBUG req.session: ", req.session);
      next();
    }
    else {
      console.log("DEBUG no signed cookie...");
      let err = setError(resp);
      next(err);
    }
  }
}

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321')); // this is supposed to be secret... (server)
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, _resp, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, resp, _next) {
  // set locals, only providing error in development
  resp.locals.message = err.message;
  resp.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  resp.status(err.status || 500);
  resp.render('error');
});

module.exports = app;
