const mongoose = require('mongoose');

const orderUniqueValidator = require('./validators/orderUniqueValidator');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderId : {
        type : String,
        required : true,
        unique: true,
        index : true
    },
    orderProductLink:{
        type:String,
        default:''
    }
},{
    timestamps : true
})

orderUniqueValidator.validators.orderValidator(orderSchema);

module.exports = mongoose.model('order',orderSchema);