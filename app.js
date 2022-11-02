var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Non-default modules.
let session = require('express-session');
let cors = require('cors');
let passport = require('passport');

const MongoStore = require('connect-mongo');
require('dotenv').config();


/**
 * -------------- GENERAL SET UP ------------------------------------
 */


var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * -------------- SESSION SET UP ------------------------------------
 */

app.use(session({
  secret: 'HELLO',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  cookie: {
    maxAge: 10000
  }
}));

/**
 * -------------- VIEW ENGINE SET UP - REMOVE LATER -----------------
 */

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/**
 * -------------- CROSS ORIGIN RESOURCE CONFIG ----------------------
 */

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000']
}))

/**
 * -------------- PASSPORT AUTHENTICATION ---------------------------
 */

require('./config/passport_jwt');

app.use(passport.initialize());

/**
 * -------------- ROUTES --------------------------------------------
 */

let indexRouter = require('./routes/index');

app.use('/', indexRouter);


/**
 * -------------- ERROR HANDLING ------------------------------------
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
