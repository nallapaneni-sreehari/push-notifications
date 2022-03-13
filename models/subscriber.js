const mongoose = require('mongoose');

const Subscriber = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    appId:{
        type:String,
        required:true
    },
    subscription:{
        type:Object,
        required:true
    },
    browserInfo:{
        type:Object,
        required:true
    },
    osInfo:{
        type:Object,
        required:true
    },
    createdAt:{
        type:String,
        required:true,
        default:Date.now()
    },
    updatedAt:{
        type:String,
        required:true,
        default:Date.now()
    },
    ipAddress:{
        type:String,
        required:false
    },
    location:{
        type:Object,
        required:false
    }
});

module.exports = mongoose.model("subscriber", Subscriber);