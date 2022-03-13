console.log(`service worker loaded...`);

self.addEventListener('push', e=>{
    console.log("Worker::: ", e);
    
    const data = e.data.json();

    console.log(`push received`);
    
    self.registration.showNotification(data.title, {
        body: 'Hello world',
        icon:'http://image.ibb.co/frYOFd/tmlogo.png'
    })
});