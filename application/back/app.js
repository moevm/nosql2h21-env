var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');

var indexRouter = require('./routes/index');
var statsRouter = require('./routes/stats');

var app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/stats', statsRouter);

module.exports = app;
