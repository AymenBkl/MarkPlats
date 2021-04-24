const mongoose = require("mongoose");
const fs = require('fs');
const { config } = require("../config");



module.exports = mongoose
  .connect(config.mongoDB.url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then((db) => {
    console.log("Connected DB")
  }) 
  .catch((err) => {
    console.log(err);
  });