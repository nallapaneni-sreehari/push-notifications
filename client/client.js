const publicVapidKey =
  "BImTqKD5brY-i46PVRmRxviFSn2mgLid6lc9es7lDkKZI6C1eUFzRt-vbby5MKEONENBgqGXddRpHSWqOlY1Dcs";
const workerCdn =
  "https://cdn.jsdelivr.net/gh/sreeharinallapaneni149/push-notifications/client/worker.js";

var appId = "";

var subscription = {};

main();

async function main() {
  if ("serviceWorker" in navigator) {
    await registerServiceWorker();

    getSubscription().then((res) => {
      subscription = res;
    });

    console.log("Subscription::: ", subscription);

    if (subscription?.endpoint) {
      console.log(`subscription already there :: `, subscription.endpoint);
    } else {
      let subscription = await subscribe();
      console.log(`subscription in main else::: `, subscription);
    }

    // notify().catch(err => console.log("Error sending notification..", err));
  } else {
    // notify().catch(err => console.log("Error sending notification..", err));
    console.log("Browser not supported...!");
  }
}

async function provideAppId(id) {
  console.log(`ProvideAppId::: `, id);
  appId = id;
}

async function getSubscription() {
  return navigator.serviceWorker.ready.then(function (registration) {
    return registration.pushManager.getSubscription();
  });
}

async function subscribe() {
  navigator.serviceWorker.ready
    .then(function (registration) {
      console.log("service ready subbbb", subscription.endpoint);

      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
    })
    .then(async function (subscription) {
      console.log("Subscribed", subscription.endpoint);
      await callToSubscribe(subscription);
    })
    .catch((err) => {
      console.log(`error in subscribe()`, err);
    });
}

console.log(`App ID::: `, appId);

async function sendNotification(data) {
  console.log(`Send this n::: `, data);

  // await fetch('http://localhost:5001/sendNotification', {
  await fetch("https://push-notifications-iota.vercel.app/sendNotification", {
    method: "POST",
    body: JSON.stringify(JSON.parse(data)),
    headers: {
      "content-type": "application/json",
    },
  });
  console.log(`Sent Notification::: `);
}

async function deleteNotification(data) {
  console.log(`Send this n::: `, data);

  // await fetch('http://localhost:5001/deleteNotification', {
  await fetch("https://push-notifications-iota.vercel.app/deleteNotification", {
    method: "POST",
    body: JSON.stringify(JSON.parse(data)),
    headers: {
      "content-type": "application/json",
    },
  });
}

async function registerServiceWorker() {
  navigator.serviceWorker.register("/worker.js").then(async function (reg) {
    if (reg.installing) {
      console.log("Service worker installing");
    } else if (reg.waiting) {
      console.log("Service worker installed");
    } else if (reg.active) {
      console.log("Service worker active");
    }
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function callToSubscribe(subscription) {
  var clientName =
    localStorage.getItem("user") ||
    localStorage.getItem("username") ||
    localStorage.getItem("userName") ||
    localStorage.getItem("email") ||
    localStorage.getItem("UserName");

  // await fetch('http://localhost:5001/subscribe',{
  await fetch("https://push-notifications-iota.vercel.app/subscribe", {
    method: "POST",
    body: JSON.stringify({ appId, subscription, clientInfo, clientName }),
    headers: {
      "content-type": "application/json",
    },
  });

  console.log("Push sent.....");
}

let clientInfo = (function (window) {
  {
    var unknown = "-";

    // screen
    var screenSize = "";
    if (screen.width) {
      width = screen.width ? screen.width : "";
      height = screen.height ? screen.height : "";
      screenSize += "" + width + " x " + height;
    }

    // browser
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = "" + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // Opera
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
      browser = "Opera";
      version = nAgt.substring(verOffset + 6);
      if ((verOffset = nAgt.indexOf("Version")) != -1) {
        version = nAgt.substring(verOffset + 8);
      }
    }
    // Opera Next
    if ((verOffset = nAgt.indexOf("OPR")) != -1) {
      browser = "Opera";
      version = nAgt.substring(verOffset + 4);
    }
    // Legacy Edge
    else if ((verOffset = nAgt.indexOf("Edge")) != -1) {
      browser = "Microsoft Legacy Edge";
      version = nAgt.substring(verOffset + 5);
    }
    // Edge (Chromium)
    else if ((verOffset = nAgt.indexOf("Edg")) != -1) {
      browser = "Microsoft Edge";
      version = nAgt.substring(verOffset + 4);
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
      browser = "Microsoft Internet Explorer";
      version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
      browser = "Chrome";
      version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
      browser = "Safari";
      version = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf("Version")) != -1) {
        version = nAgt.substring(verOffset + 8);
      }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
      browser = "Firefox";
      version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf("Trident/") != -1) {
      browser = "Microsoft Internet Explorer";
      version = nAgt.substring(nAgt.indexOf("rv:") + 3);
    }
    // Other browsers
    else if (
      (nameOffset = nAgt.lastIndexOf(" ") + 1) <
      (verOffset = nAgt.lastIndexOf("/"))
    ) {
      browser = nAgt.substring(nameOffset, verOffset);
      version = nAgt.substring(verOffset + 1);
      if (browser.toLowerCase() == browser.toUpperCase()) {
        browser = navigator.appName;
      }
    }
    // trim the version string
    if ((ix = version.indexOf(";")) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(" ")) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(")")) != -1) version = version.substring(0, ix);

    majorVersion = parseInt("" + version, 10);
    if (isNaN(majorVersion)) {
      version = "" + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }

    // mobile version
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

    // cookie
    var cookieEnabled = navigator.cookieEnabled ? true : false;

    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
      document.cookie = "testcookie";
      cookieEnabled =
        document.cookie.indexOf("testcookie") != -1 ? true : false;
    }

    // system
    var os = unknown;
    var clientStrings = [
      { s: "Windows 10", r: /(Windows 10.0|Windows NT 10.0)/ },
      { s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/ },
      { s: "Windows 8", r: /(Windows 8|Windows NT 6.2)/ },
      { s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/ },
      { s: "Windows Vista", r: /Windows NT 6.0/ },
      { s: "Windows Server 2003", r: /Windows NT 5.2/ },
      { s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/ },
      { s: "Windows 2000", r: /(Windows NT 5.0|Windows 2000)/ },
      { s: "Windows ME", r: /(Win 9x 4.90|Windows ME)/ },
      { s: "Windows 98", r: /(Windows 98|Win98)/ },
      { s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/ },
      { s: "Windows NT 4.0", r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
      { s: "Windows CE", r: /Windows CE/ },
      { s: "Windows 3.11", r: /Win16/ },
      { s: "Android", r: /Android/ },
      { s: "Open BSD", r: /OpenBSD/ },
      { s: "Sun OS", r: /SunOS/ },
      { s: "Chrome OS", r: /CrOS/ },
      { s: "Linux", r: /(Linux|X11(?!.*CrOS))/ },
      { s: "iOS", r: /(iPhone|iPad|iPod)/ },
      { s: "Mac OS X", r: /Mac OS X/ },
      { s: "Mac OS", r: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
      { s: "QNX", r: /QNX/ },
      { s: "UNIX", r: /UNIX/ },
      { s: "BeOS", r: /BeOS/ },
      { s: "OS/2", r: /OS\/2/ },
      {
        s: "Search Bot",
        r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
      },
    ];
    for (var id in clientStrings) {
      var cs = clientStrings[id];
      if (cs.r.test(nAgt)) {
        os = cs.s;
        break;
      }
    }

    var osVersion = unknown;

    if (/Windows/.test(os)) {
      osVersion = /Windows (.*)/.exec(os)[1];
      os = "Windows";
    }

    switch (os) {
      case "Mac OS":
      case "Mac OS X":
      case "Android":
        osVersion =
          /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(
            nAgt
          )[1];
        break;

      case "iOS":
        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
        osVersion =
          osVersion[1] + "." + osVersion[2] + "." + (osVersion[3] | 0);
        break;
    }

    // flash (you'll need to include swfobject)
    /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
    var flashVersion = "no check";
    if (typeof swfobject != "undefined") {
      var fv = swfobject.getFlashPlayerVersion();
      if (fv.major > 0) {
        flashVersion = fv.major + "." + fv.minor + " r" + fv.release;
      } else {
        flashVersion = unknown;
      }
    }
  }

  console.log("clientInfo::: jscd", window.jscd);

  return (window.jscd = {
    screen: screenSize,
    browser: browser,
    browserVersion: version,
    browserMajorVersion: majorVersion,
    mobile: mobile,
    os: os,
    osVersion: osVersion,
    cookies: cookieEnabled,
    flashVersion: flashVersion,
  });
})(this);

console.log("clientInfo:::", clientInfo);
