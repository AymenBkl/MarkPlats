var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const loggerApi = require('./Middlewares/logger').loggerApi;
var authRouter = require('./routes/auth');
var bolRouter = require('./routes/bolApi');
var productRouter = require('./routes/product');
var logsRouter = require('./routes/logs');

var app = express();

const cors = require('./Middlewares/cors');
const userInfo = require('./Middlewares/getUserInfo');
const httpsRedirect = require('./Middlewares/https.redirect');
const limiter = require('./Middlewares/ddos.limiter');
const mongoose = require('./Middlewares/mongoose');
var passport = require('passport');


// view engine setup
app.use('/api',express.static(path.join(__dirname, '/public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('aymenxyzbkl12345678910'));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(httpsRedirect);
app.use(cors.corsWithOptions);
app.use(userInfo.userInfo);
app.use(limiter.limiter);
app.use('/auth', authRouter);
app.use('/bol', bolRouter);
app.use('/product', productRouter);
app.use('/logs', logsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  loggerApi.error(JSON.stringify({error:String(createError(404)),status:500,endPoint:'Main',msg:"Error Happend"}));
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  loggerApi.error(JSON.stringify({error:String(err.message),status:500,endPoint:'Main',msg:"Error Happend"}));

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
