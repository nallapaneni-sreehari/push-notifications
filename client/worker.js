console.log(`service worker loaded...`);

self.addEventListener("push", (e) => {
  console.log("Worker::: ", e.data.json());

  const data = e.data.json();

  var views = { id: data.data.notification_id, viewCount: 1 };

  console.log(`push received, views::: `, views);

  // fetch('http://localhost:5001/updateViewsClicks',{
  fetch("https://push-notifications-iota.vercel.app//updateViewsClicks", {
    method: "POST",
    body: JSON.stringify({ views }),
    headers: {
      "content-type": "application/json",
    },
  }).then((res) => console.log(`updated views`));

  self.registration.showNotification(data.title, {
    body: data.msg,
    icon: data.icon,
    badge: data.image,
    image: data.image,
    data: data.data,
  });
});

self.addEventListener("notificationclick", async function (e) {
  console.log(`onClick worker:::`, e.notification);

  const data = e.notification.data;

  var clicks = { id: data?.notification_id, clickCount: 1 };
  console.log(`Clicked:::`, clicks);

  e.notification.close();

  e.waitUntil(clients.openWindow(data?.url));

  // await fetch('http://localhost:5001/updateViewsClicks',{
  await fetch("https://push-notifications-iota.vercel.app//updateViewsClicks", {
    method: "POST",
    body: JSON.stringify({ clicks }),
    headers: {
      "content-type": "application/json",
    },
  });
});
