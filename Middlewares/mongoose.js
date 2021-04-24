const mongoose = require("mongoose");
const fs = require('fs');

const loggerApi = require('./logger').loggerApi;

const config = require('../config');

var key = fs.readFileSync(process.mainModule.path + '\\mongoSSL\\mongodb.pem');

var ca = fs.readFileSync(process.mainModule.path + '\\mongoSSL\\rootCA.pem');


var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslValidate:false,
    sslCA: ca,
    sslCert:key,
    sslKey:key,
};

module.exports = mongoose
  .connect(config.config.mongoDB.url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslValidate:false,
    sslCA: ca,
    sslCert:key,
    sslKey:key,
    user:config.config.mongoDB.user,
    pass: config.config.mongoDB.pwd
})
  .then((db) => {
    loggerApi.http(JSON.stringify({status:200,endPoint:'Database',msg:"Connection Succesfully"}));
  }) 
  .catch((err) => {
    loggerApi.error(JSON.stringify({error:String(err.message),status:500,endPoint:'Main',msg:"Error Happend"}));
  });