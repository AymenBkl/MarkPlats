const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    os:{
        name : {
            type: String,
        },
        short_name:{
            type:String,
        },
        platform:{
            type:String,
        },
        family:{
            type:String
        }
    },
    client : {
        type:{
            type:String
        },
        name:{
            type:String
        },
        short_name:{
            type:String
        },
        version:{
            type:String
        },
        engine:{
            type:String
        },
        engine_version:{
            type:String
        },
        family:{
            type:String
        },
    },
    device: {
        id:{
            type:String
        },
        type:{
            type:String
        },
        brand:{
            type:String
        },
        model:{
            type:String
        }
    },

    ip:{
        type:String
    }
    
}, {
    timestamps: true
})
module.exports = mongoose.model('device', deviceSchema);