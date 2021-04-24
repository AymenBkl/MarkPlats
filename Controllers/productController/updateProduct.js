const productModel = require('../../Models/product');
const productResponse = require('../../HandlerProducts/response.controller');

module.exports.updateProduct = (res,ean,query) => {
    productModel.findOneAndUpdate({productEan:ean},query,{$upsert: true, $new: true})
        .then((updated) => {
            if (updated) {
                productResponse.response('success',res,'PRODUCTS UPDATED',200,updated,'UPDATE PRODUCT');
            }
            else {
                productResponse.response('error',res,'Something Went Wrong !',500,null,'UPDATE PRODUCT','SOMETHING WENT WRONG !');

            }
        })
        .catch(err => {
            console.log(err);
            productResponse.response('error',res,'Something Went Wrong !',500,null,'UPDATE PRODUCT',err);
        })
}