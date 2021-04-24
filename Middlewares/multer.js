const multer = require('multer');

var uuid = require('uuid');

var storage = multer.diskStorage(
    {
        destination: './public/images/',
        filename: function ( req, file, cb ) {
            cb( null, uuid.v4() + '.' + file.mimetype.split('/')[1] );
        }, 
    }
);
module.exports.upload = multer( { storage: storage } );