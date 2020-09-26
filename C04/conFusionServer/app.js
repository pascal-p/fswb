let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let FileStore = require('session-file-store')(session);
let passport = require('passport');
let authenticate = require('./authenticate');
let config = require('./config');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require('./routes/favoriteRouter');
const commentRouter = require('./routes/commentRouter');

const Dishes = require('./models/dishes');

const url = config.mongoUrl;
const connect = mongoose.connect(url,
                                 { useUnifiedTopology: true,
                                   useFindAndModify: false,  // https://mongoosejs.com/docs/deprecations.html#findandmodify
                                   useNewUrlParser: true });


connect.then((db) => {
  console.log("DEBUG: Connected correctly to DB server");
}, (err) => { console.log(err); });


// App
let app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
  console.log("DEBUG: secure traffic: ", req.secure, " / hostname: ", req.hostname);

  if (req.secure) {
    return next();
  }
  else {
    // 307 Temporary Redirect (since HTTP/1.1)
    // In this case, the request should be repeated with another URI; however, future requests should still
    // use the original URI. In contrast to how 302 was historically implemented, the request method is not
    // allowed to be changed when reissuing the original request.
    // For example, a POST request should be repeated using another POST request.
    res.redirect(307,
                 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
app.use('/comments', commentRouter);

// catch 404 and forward to error handler
app.use((req, _resp, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, resp, _next) => {
  // set locals, only providing error in development
  resp.locals.message = err.message;
  resp.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  resp.status(err.status || 500);
  resp.render('error');
});

module.exports = app;
