var express = require('express');
var router = express.Router();
const markplats = require('../Controllers/Markplats/markplats.controller');
const cors = require('../Middlewares/cors');

router.all('/', function(req, res, next) {
    next();
})
.options('/',cors.corsWithOptions,  function(req, res, next) {
    next();
})
.get('/getsheet',cors.corsWithOptions, markplats.getSheet)

.get('/getlinks',cors.corsWithOptions, markplats.getLinks)

.post('/addlink',cors.corsWithOptions, markplats.addLink);


module.exports = router;




module.exports = router;

