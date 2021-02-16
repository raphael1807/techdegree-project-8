var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ------------------------------------------
// Import sequelize from models/index.js
// ------------------------------------------
const { sequelize } = require('./models');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// ------------------------------------------
// ASYNCHRONOUSLY CONNECT TO THE DATABASE
// ------------------------------------------
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection success!');

    /* Sync the model with the database */
    await sequelize.sync();
  } catch (err) {

    console.log('Error while connecting to the database: ', err);
  }
})();

// ------------------------------------------
// VIEW ENGINE SETUP
// ------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------
// MAIN ROUTE
// ------------------------------------------
app.use('/', indexRouter);

// ------------------------------------------
// ERROR HANDLERS ROUTE
// 404 HANDLER CATCHER
// ------------------------------------------
app.use((req, res, next) => {
  const err = new Error(`These are uncharted waters.⛵ The page requested does not exist!😞`);
  err.status = 404;
  console.log(`💻 Error ${err.status} ️⚠️ ${err.message}`);
  next(err);
});

// ------------------------------------------
// GLOBAL HANDLE ERRORS
// ------------------------------------------
app.use((err, req, res, next) => {
  // If err.status === 404, render page-not-found.
  if (err.status === 404) {
    res.status(404);
    res.render('page-not-found', { err });
  }
  // Else if err.status is not 404, render error.
  else {
    err.message = err.message || `Oops - Our servers is on a break. 🚧`;
    res.status(err.status || 500);
    res.render('error', { err });
  }
});



module.exports = app;