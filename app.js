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
// ------------------------------------------
const errorHandlers = require('./routes/errors');
app.use(errorHandlers);

module.exports = app;