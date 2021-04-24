var express = require('express');
var router = express.Router();
const markplats = require('../Controllers/Markplats/markplats.controller');
/* GET home page. */
router.get('/getsheet',markplats.getSheet);

module.exports = router;
