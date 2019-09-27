const crypto = require('crypto');
const express = require('express');
const app = express();
const Worker = require('webworker-threads').Worker;

// Worker thread will create a worker object that operates in a different thread outside of nodejs eventloop
// Variables will all be separate.

app.get('/', (req, res) => {
  // Keep in my that closure stops working with workers because workers are disconnected from node to perform a task
  // postMessage is used to communicate between node, and the worker.
  // Keyword functions is important due to we need 'this' to reference worker 
  const worker = new Worker(function () {
    this.onmessage = function () {
      let counter = 0;
      while (counter < 1e9) {
        counter++;
      }
      postMessage(counter);
    }
  });

  // callback for postMessage from the worker
  worker.onmessage = function (message) {
    console.log(message.data);
    res.send(message.data + "")
  }

  // To call the worker thread.
  worker.postMessage();

})


app.listen(process.env.PORT || 3000)