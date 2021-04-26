const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const notifcationSchema = new Schema({
    link: {
        type: String,
        require:true,
    },
    itemId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    sent:{
        type:Boolean
    }
}, {
    timestamps: true
})

notifcationSchema.index({link:1,itemId:1,email:1},{name:'notificationIndex'});

module.exports = mongoose.model('notification',notifcationSchema);