const https = require('https');

// To test how long it takes to make a request to google.com via node.
const start = Date.now();
const request = () => (
  https.request('https://www.google.com', res => {
    res.on('data', () => { });
    res.on('end', () => {
      console.log(Date.now() - start);
    });
  }).end()
)

// While the default threadpool is 4, however, when this runs, all 6 requests are done almost simultaenously.
// Why? Because this doesn't use multi-thread. This uses the OS's async features to make the request, so libuv doesn't just 
// use threads for functions but also the outlying os.
request();
request();
request();
request();
request();
request();