const mongoose = require('mongoose');

module.exports.validators = {
    hashValidator : (schema) => {
        schema.path('hashId').validate(async (value) => {
            const hashCount = await mongoose.models.hash.countDocuments({hash: value });
            return !hashCount;
          }, 'hash already exists');
    },

}