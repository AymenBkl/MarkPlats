const mongoose = require('mongoose');

const hashUniqueValidator = require('./validators/storeUniqueValidator');

const storeUniqueValidator = require('./validators/storeUniqueValidator');

const Schema = mongoose.Schema;

const storeSchema = new Schema({
    link: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
}, {
    timestamps: true
})

storeUniqueValidator.validators.storeValidator(storeSchema);
module.exports = mongoose.model('store', storeSchema);