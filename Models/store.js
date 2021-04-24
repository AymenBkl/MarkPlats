const mongoose = require('mongoose');

const hashUniqueValidator = require('./validators/hashUniqueValidator');

const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const hashSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    lastName: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    imageURL: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'admin'
    },
    devices:[{
        
    }]
}, {
    timestamps: true
})
hashSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('admin', hashSchema);