const createProduct = require('./createProduct');

const getProducts = require('./getProducts');

const updateProduct = require('./updateProduct');

const uplaodImage = require('./uploadImage');

const loggerProduct = require('../../Middlewares/logger').loggerProduct;

module.exports = {
    createProduct: (products) => {
        loggerProduct.info(JSON.stringify({endPoint:'CREATE PRODUCT',msg:'Creating Product'}));
        createProduct.createProducts(products);
    },

    getProducts: (req, res, next) => {
        loggerProduct.info(JSON.stringify({endPoint:'Get  PRODUCT',msg:'Getting Products'}));
        getProducts.getProduct(res);
    },

    updateProduct: (req, res, next) => {
        loggerProduct.info(JSON.stringify({endPoint:'UPDATE PRODUCT',msg:'Update Product'}));
        const query = {
            $set: {
                productLinkPhilips: req.body.newLink,

            }
        }
        updateProduct.updateProduct(res,req.body.ean, query);
    },

    postImage : (req,res,next) => {
        loggerProduct.info(JSON.stringify({endPoint:'POST IMAGE',msg:'Posting Image'}));
        uplaodImage.upload(req,res);
    }


}