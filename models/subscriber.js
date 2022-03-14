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
    isMobile:{
        type:String,
        required:false
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        required:false,
        // default:Date.now()
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

module.exports = mongoose.model("subscribers", Subscriber);