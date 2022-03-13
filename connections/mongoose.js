const mongoose = require('mongoose');

async function connect()
{
    const connectionUrl = "mongodb+srv://r151149:sree123@cluster0.ecexy.mongodb.net/subscriber?retryWrites=true&w=majority";

    mongoose.connect(connectionUrl, {useNewUrlParser:true, useUnifiedTopology:true}, (err)=>{
        if(err) throw err;
        console.log("Connected to Database");
    });
}

module.exports = {
    connect:connect
}