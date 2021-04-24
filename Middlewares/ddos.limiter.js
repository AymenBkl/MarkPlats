var RateLimit = require('express-rate-limit');
var app = require('express')();

app.enable('trust proxy'); 
 
module.exports.limiter = new RateLimit({
  windowMs: 60, 
  max: 100,  
  delayMs: 0 
});