const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const keys = require('./config/keys.json');
const cors = require('cors');
const geoip = require('geoip-lite');
const mongoConnection = require('./connections/mongoose');
const subscriberModel = require('./models/subscriber');

mongoConnection.connect();

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client')));

app.use(cors());

webpush.setVapidDetails('mailto: nallapaneni.sreehari@gmail.com', keys.publicVapidKey, keys.privateVapidKey);

app.post('/subscribe', async (req,res)=>{

    console.log("Body::: ", req.body);

    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    var location = geoip.lookup(ip);


    var subscriber = {
        name:req.body?.clientName,
        appId:req.body?.appId,
        subscription:req.body?.subscription,
        browserInfo:{browser:req.body?.clientInfo?.browser,browserVersion:req.body?.clientInfo?.browserVersion},
        osInfo:{os:req.body?.clientInfo?.os, osVersion:req.body?.clientInfo?.osVersion},
        ipAddress:ip,
        location:location,
    };

    console.log("subscriber::: ",subscriber);

    await subscriberModel.create(subscriber);

    res.status(201).json({});

    const payload = JSON.stringify({title: 'Push Test Notification'});

    // webpush.sendNotification(subscription, payload).catch(err=>console.error(err));

});


app.post('/sendNotification', async (req,res)=>{

    // console.log("Body::: ", req.body);
    const subscription = req.body?.subscription;

    const {msg,title,icon} = req.body;

    res.status(201).json({});

    const payload = JSON.stringify({msg, title, icon});

    webpush.sendNotification(subscription, payload).catch(err=>console.error(err));

});



const PORT = process.env.PORT || 5001;

app.listen(PORT, err=>{
    if(err) throw err;

    console.log(`Server started on ${PORT}`);
});