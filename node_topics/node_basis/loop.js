// A pseudo representation of the Node env


// Think of these as stacks that get populated as node runs.
const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];


const shouldContinue = () => {
  // Check whether any of the above 'stacks' are still running
  // Technically Node is single threaded via the Event loop
  // However because of what happens in node internally
  // Node's event loop makes use of multi-threading, and asyncs via delegation.
  return pendingTimers.length || pendingTimers.length || pendingOperations.length;
}

const executeAllSetImmediates = () => {
  // ...
}

const handeCloseEvents = () => {
  // ...
}

// Think of this as node running.
const nodeRun = () => {
  while (shouldContinue()) {
    // ...
  }

  executeAllSetImmediates();
  handeCloseEvents();
}

/*
  Basically as node executings instructions, those 'stacks' would get populated, and so long as those
  queues remained populated, node continues.
*/
