const mongoose = require('mongoose');


const storeUniqueValidator = require('./validators/storeUniqueValidator');

const Schema = mongoose.Schema;

const storeSchema = new Schema({
    link: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    storeName:{
        type:String,
        required:true
    },
    expiration:{
        type: Date, 
        default: Date.now() 
    }
}, {
    timestamps: true
})

storeUniqueValidator.validators.storeValidator(storeSchema);
module.exports = mongoose.model('store', storeSchema);