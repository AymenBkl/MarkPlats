const express = require("express");

const cors = require("cors");


const config = require('../config');

const whiteList = [config.config.webURL,config.config.url,config.config.https,'http://localhost:4200'];

const loggerAuth = require('./logger').loggerAuth;

var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  const index = whiteList.indexOf(req.header("Origin"));  
  if (true) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
    loggerAuth.error(JSON.stringify({error:'CORS',status:401,endPoint:'CORS',msg:'CORS NOT ALLOWED'}));

    callback('Not allowed by CORS',corsOptions)
  }
  callback(null,corsOptions);
};

var corsOptionsDeletePut = (req, callback) => {
    var corsOptions;
    if (whiteList.indexOf(req.header("Origin")) !== -1) {
      corsOptions = { origin: true };
    } else {
      corsOptions = { origin: false };
    }
    callback(null, corsOptions);
  };

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
