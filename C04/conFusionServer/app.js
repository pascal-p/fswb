var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
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
  console.log("DEBUG: " + req.headers);

  let authHeader = req.headers.authorization;
  if (!authHeader) {
    let err = setError(resp);
    next(err);
    return;
  }

  let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  let [user, pass] = auth; // [auth[0], auth[1]];
  console.log(`DEBUG: auth user: ${user} / pass: ${pass}`);

  if (user === 'admin' && pass === 'pass-8421') {
    console.log('DEBUG: authorized');
    next(); // authorized
  }
  else {
    let err = setError(resp);
    console.log('DEBUG: NOT authorized');
    next(err);
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
app.use(cookieParser());
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
