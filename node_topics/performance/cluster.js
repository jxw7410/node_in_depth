// Node Clustering
// changing pool size per child to test cluster weaknesses
process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');
const crypto = require('crypto');

if (cluster.isMaster) {
  // Creates copies of this file, and run them.
  // With the exception that the generated copies all know they aren't the master
  // But rather child(ren)
  // Clusters work up to a certain point, and depends on the number of the cpus.
  // My mac is 6 cores, so running 6 instances is ideal before it becomes detrimental.
  // If you have more than 6 clusters all 6 cpus will try to bounce between all the clusters
  // Thus causing perfomrance drop.
  const clusterInstances = 2;

  for (let i = 0; i < clusterInstances; i++) {
    cluster.fork();
  }

} else {
  const express = require('express');
  const app = express();

  app.get('/', (req, res) => {
    crypto.pbkdf2('super_secure_password', 'b', 100000, 512, 'sha512', (err, key) => {
      res.send('hashing complete');
    });
  })


  app.listen(process.env.PORT || 3000)
}