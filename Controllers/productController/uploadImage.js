

const updateProduct = require('./updateProduct');

const response = require('../../HandlerProducts/response.controller');

module.exports.upload = (req, res) => {
    console.log(req.body.ean);
    if (req.file) {
        var fullUrl = 'https://192.168.1.104:3443/api/images/' + req.file.filename;
        const query = {
            $set: {
                imageURL:fullUrl,

            }
        }
        updateProduct.updateProduct(res,req.body.ean,query)

    } else {
        response.response("error", res, "IMAGE NOT PRESENT", 500, null,'POST IMAGE','IMAGE NOT PRESENT');
    }
}
