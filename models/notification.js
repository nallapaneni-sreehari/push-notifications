const mongoose = require('mongoose');

const Notification = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    appId:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        required:true
    },
    badge:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
    },
    url:{
        type:String,
        required:false
    },
    status:{
        type:String,
        required:true,
        default:"created"
    },
    views:{
        type:Number,
        required:true,
        default:0
    },
    clicks:{
        type:Number,
        required:true,
        default:0
    },
    delivered:{
        type:Number,
        required:true,
        default:0
    },
    actions:{
        type:Array,
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
    sentAt:{
        type:Date,
        required:false,
        // default:Date.now()
    }
});

module.exports = mongoose.model("notifications", Notification);