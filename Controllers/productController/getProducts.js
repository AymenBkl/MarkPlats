const productModel = require('../../Models/product');

const productResponse = require('../../HandlerProducts/response.controller');

module.exports.getProduct = (res) => {
    productModel.find({})
        .then(products => {
            if (products && products.length > 0){
                productResponse.response('success',res,'PRODUCTS LOADDED',200,products,'GET PRODUCTS');
            }
            else if (products && products.length == 0 ){
                productResponse.response('error',res,'NO PRODUCTS FOUND',404,null,'GET PRODUCT','PRODCT NOT FOUND');
            }
            else {
                productResponse.response('error',res,'Something Went Wrong !',500,null,'GET PRODUCT','Something Went Wrong !');
            }
        })
        .catch(err => {
            console.log(err);
            productResponse.response('error',res,'Something Went Wrong !',500,null,'GET PRODUCT',err);
        })
}