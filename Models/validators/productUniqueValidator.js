const mongoose = require('mongoose');

module.exports.validators = {
    eanValidator : (schema) => {
        schema.path('productEan').validate(async (value) => {
            const eanCount = await mongoose.models.product.countDocuments({productEan: value });
            return !eanCount;
          }, 'productEan already exists');
    },

    titleValidator : (schema) => {
        schema.path('productTitle').validate(async (value) => {
            const productTitleCount = await mongoose.models.product.countDocuments({productTitle: value });
            return !productTitleCount;
          }, 'productTitle already exists');
    },

}