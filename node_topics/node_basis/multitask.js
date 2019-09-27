// Combination of it all to witness some interesting behaviour

const fileStream = require('fs');
const crypto = require('crypto');
const https = require('https');


const start = Date.now();
const request = () => (
  https.request('https://www.google.com', res => {
    res.on('data', () => { });
    res.on('end', () => {
      console.log('https:', Date.now() - start);
    });
  }).end()
)


const hash = num => {
  crypto.pbkdf2('super_secure_password', 'b', 100000, 512, 'sha512', (err, key) => {
    console.log(`hash_${num}:`, Date.now() - start);
  });
}

//process.env.UV_THREADPOOL_SIZE = 5;

// What order would these appear on the console?
// This has alot to do with how node uses the event loop to execute functions, and delegate them to the OS, and/or c++ 
request();
fileStream.readFile('multitask.js', 'utf8', () => {
  console.log('FS:', Date.now() - start);
});
hash(1);
hash(2);
hash(3);
hash(4);


// The order of execution for these would be request --> hash ---> fs ---> hash x 3.
// But why?

/* 
Breakdown:

The FS module, and the Crypto Module both uses the the thread pool,
The Https uses the OS module.

So the HTTP call doesn't care about the thread pool since it uses the OS to do all the requests. 
And once the request comes back, Node would do something with it

FS does a few things.
It first checks for the metadata of the file. When node knows what it needs to read, it starts reading. 

So how does this influence the order in which all events come back.

Simple.

So the default threadpool is 4. Because of FS, there are 5 task waiting to execute on a line of 4.

However when FS executes, while it is reading meta data, it is momentarity set aside, and the thread for a task that is waiting gets executed.

Then the FS finishes reading, and it waits until any thread is freed up. Surely one of the hash functions is done, therefore FS immediately takes the place on the thread,
and signaled that it's done reading, 

But why does is it number 2 but not the last?

Because FS is super fast compared to the hashing algorithm, removed the hashes and you'll see it executes in like 2x ms.

BONUS what happens when uv_threadpool_size = 5?
*/


