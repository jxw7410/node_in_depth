// Node Clustering will be done with PM2, a library that manages node clusters for us



const crypto = require('crypto');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  crypto.pbkdf2('super_secure_password', 'b', 100000, 512, 'sha512', (err, key) => {
    res.send('hashing complete');
  });
})


app.listen(process.env.PORT || 3000)
