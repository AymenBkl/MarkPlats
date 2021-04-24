const mongoose = require('mongoose');

module.exports.validators = {
    txidValidator : (schema) => {
        schema.path('txid').validate(async (value) => {
            const txidCount = await mongoose.models.depositschema.countDocuments({txid: value });
            return !txidCount;
          }, 'txid already exists');
    },

}