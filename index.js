const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const keys = require('./config/keys.json');
const cors = require('cors');
const geoip = require('geoip-lite');
const mongoConnection = require('./connections/mongoose');
const subscriberModel = require('./models/subscriber');
const notificationModel = require('./models/notification');
var ObjectId = require('mongodb').ObjectId;


mongoConnection.connect();

const app = express();

app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'client'));

app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));

app.use(express.static(path.join(__dirname, 'client')));

app.use(cors());

webpush.setVapidDetails('mailto: nallapaneni.sreehari@gmail.com', keys.publicVapidKey, keys.privateVapidKey);


app.get('/', async (req, res)=>{
    let notification = await notificationModel.find({});

    console.log(`notifications::: `,notification);
    
    res.render('index', {notifications:notification});
});


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
        isMobile:req.body?.clientInfo?.mobile
    };

    console.log("subscriber::: ",subscriber.appId);

    let subscriptionExists = await subscriberModel.find({subscription:subscriber.subscription});

    console.log(`subscriptionExists::: `, subscriptionExists[0]?.ipAddress);
    
    if(subscriptionExists?.length>0)
    {
        await subscriberModel.findOneAndUpdate({subscription:subscriber.subscription},{subscriber});
    }
    else
    {
        await subscriberModel.create(subscriber);
    }


    res.status(201).json({});

    const payload = JSON.stringify({title: 'Push Test Notification'});

    // webpush.sendNotification(subscription, payload).catch(err=>console.error(err));

});


app.post('/sendNotification', async (req,res)=>{

    console.log("Body::: ",req.body._id );

    var subscriptionsInfo = [];
    subscriptionsInfo = await subscriberModel.find({ appId: req.body.appId});

    console.log(`subscriptionnn::: subscriptionsInfo`,subscriptionsInfo);
    
    for(let subscription of subscriptionsInfo)
    {
        await sendNotification(req, subscription.subscription, res);
    }
    

});

app.post('/createNotification', async (req,res)=>{

    console.log(`Notification Data:::: `, req.body);
    
    const data = 
    {
        title:req.body?.title,
        body:req.body?.body,
        icon:req.body?.icon,
        url:req.body?.url,
        appId:req.body?.appId,
        image:req.body?.image,
    };

    try
    {
        let notification = await notificationModel.create(data);
        console.log(`AtError`, notification);
    }
    catch(e)
    {
        console.log("Error creating notification catch::: ", e);
    }
    
    res.redirect('/');
});

app.post('/updateViewsClicks', async (req,res)=>{

    console.log(`updateViewsClicks:::: `, req.body);

    if (req.body?.views) {
        await notificationModel.findOneAndUpdate({_id:ObjectId(req?.body?.views?.id)},{$inc:{views:1}});
    }
    else if (req.body?.clicks) {
        await notificationModel.findOneAndUpdate({_id:ObjectId(req?.body?.clicks?.id)},{$inc:{clicks:1}});
    }

});



async function sendNotification(req, subscription, res)
{
    const data = 
    {
        title:req.body?.title,
        msg:req.body?.body,
        icon:req.body?.icon,
        data:{notification_id:req.body?._id, url:req.body?.url},
        image:req.body?.image
    };

    // res.status(201).json({});

    const payload = JSON.stringify(data);

    try
    {
        let sendNoti = await webpush.sendNotification(subscription, payload);

        console.log(`sendNoti::: `, sendNoti);
        
        var updateObj = {
            status:"sent",
            $inc:{delivered:1},
            sentAt:Date.now()
        }
        await notificationModel.updateOne({_id:ObjectId(req.body._id)},updateObj);

        // res.status(200).send({"messaga":"Notification sent !"});
    }
    catch(e)
    {
        console.log(`Error catch while pushing...`,e);
        // res.status(500).send({"messaga":"Internal server Error !"});
    }
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, err=>{
    if(err) throw err;

    console.log(`Server started on ${PORT}`);
});