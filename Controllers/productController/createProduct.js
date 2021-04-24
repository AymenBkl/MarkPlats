const productModel = require('../../Models/product');

const loggerProduct = require('../../Middlewares/logger').loggerProduct;
module.exports.createProducts = (products) => {
    productModel.bulkWrite(
        products.map((product) =>
        ({
            updateOne: {
                filter: { productEan: product.productEan },
                update: {
                    
                    $set: {
                        productUnitPrice: product.productUnitPrice,
                        productTitle: product.productTitle,
                    },
                    $setOnInsert: {
                        productEan: product.productEan,
                     }
                },
                upsert: true,
                new: true, setDefaultsOnInsert: true
            }
        })
        )
    )
        .then(product => {
            if (product && product.upsertedIds) {
                loggerProduct.http(JSON.stringify({status:200,endPoint:'Created new Products',msg:'Created Product successfully: ' + product.upsertedCount}));
            }
            else if (product && product.upsertedIds) {
                loggerProduct.http(JSON.stringify({status:200,endPoint:'Updated Products',msg:'Product Updated successfully: ' + product.upsertedCount}));
            }
            else {
                loggerProduct.error(JSON.stringify({error:'error',status:500,endPoint:'Creating Updating Products',msg:'Something Went Wrong !'}));
            }
        })
        .catch(err => {
            loggerProduct.error(JSON.stringify({error:String(err),status:500,endPoint:'Creating Updating Products',msg:'Something Went Wrong !'}));
        })
}