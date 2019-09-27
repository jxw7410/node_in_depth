// This to change thread pool size
process.env.UV_THREADPOOL_SIZE = 5;

// crptpo actually comes from the libuv, which connects the javascript to c++
// Inside the c++ defined functions multi-threading happens. Default threadpool size is 4.
// So despite the event loop being single threaded, the multi-threading does happen.
// V8 works some magic
const crypto = require('crypto');

const start = Date.now();
crypto.pbkdf2('super_secure_password', 'b', 100000, 512, 'sha512', (err, key) => {
  console.log('1:', Date.now() - start);
});

crypto.pbkdf2('super_secure_password', 'b', 100000, 512, 'sha512', (err, key) => {
  console.log('2:', Date.now() - start);
});

crypto.pbkdf2('super_secure_password', 'b', 100000, 512, 'sha512', (err, key) => {
  console.log('3:', Date.now() - start);
});

crypto.pbkdf2('super_secure_password', 'b', 100000, 512, 'sha512', (err, key) => {
  console.log('4:', Date.now() - start);
});

crypto.pbkdf2('super_secure_password', 'b', 100000, 512, 'sha512', (err, key) => {
  console.log('5:', Date.now() - start);
}); 