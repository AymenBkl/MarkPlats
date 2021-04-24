const mongoose = require('mongoose');

const productUniqueValidator = require('./validators/productUniqueValidator');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productTitle : {
        type : String,
        required : true,
        unique: true,
        index : true
    },
    productEan:{
        type:String,
        required : true,
        unique: true,
        index : true
    },
    productUnitPrice:{
        type:Number,
        required : true,
    },
    productLinkPhilips:{
        type:String,
        default : '',
    },
    imageURL:{
        type:String,
        default : '',
    }
},{
    timestamps : true
})

productUniqueValidator.validators.eanValidator(productSchema);
productUniqueValidator.validators.titleValidator(productSchema);
module.exports = mongoose.model('product',productSchema);