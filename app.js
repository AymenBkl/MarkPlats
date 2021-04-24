var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var app = express();

const markPlatsRouter = require('./Routes/markPlats.route');
const cors = require('./Middlewares/cors');
const httpsRedirect = require('./Middlewares/https.redirect');
const limiter = require('./Middlewares/ddos.limiter');
const mongoose = require('./Middlewares/mongoose');


// view engine setup
app.use('/api',express.static(path.join(__dirname, '/public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('aymenxyzbkl12345678910'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(httpsRedirect);
app.use(cors.corsWithOptions);
app.use(limiter.limiter);

app.use('/markplats',markPlatsRouter);

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
