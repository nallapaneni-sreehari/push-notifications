console.log(`service worker loaded...`);

const cdn = "https://cdn.jsdelivr.net/gh/sreeharinallapaneni149/push-notifications/client/client.js";


self.addEventListener('push', e=>{
    console.log("Worker::: ", e);
    
    const data = e.data.json();

    console.log(`push received`);
    
    self.registration.showNotification(data.title, {
        body: 'Hello world',
        icon:'http://image.ibb.co/frYOFd/tmlogo.png'
    })
});