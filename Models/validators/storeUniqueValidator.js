const mongoose = require('mongoose');

module.exports.validators = {
    storeValidator : (schema) => {
        schema.path('link').validate(async (value) => {
            const linkCount = await mongoose.models.store.countDocuments({link: value });
            return !linkCount;
          }, 'store already exists');
    },

}