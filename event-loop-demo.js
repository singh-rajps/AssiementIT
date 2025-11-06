/**
 * Node.js Event Loop & Concurrency Demonstration
 * This file demonstrates how Node.js handles asynchronous operations
 */

console.log('=== EVENT LOOP PHASES DEMO ===\n');

// 1. Synchronous code (executes immediately)
console.log('1. Synchronous: Start');

// 2. setTimeout (Timers phase)
setTimeout(() => {
  console.log('4. Timer: setTimeout 0ms');
}, 0);

// 3. setImmediate (Check phase)
setImmediate(() => {
  console.log('5. Check: setImmediate');
});

// 4. Promise (Microtask queue - executes before next phase)
Promise.resolve().then(() => {
  console.log('3. Microtask: Promise.then');
});

// 5. process.nextTick (Microtask queue - highest priority)
process.nextTick(() => {
  console.log('2. Microtask: process.nextTick');
});

// 6. Synchronous code continues
console.log('1. Synchronous: End');

// Demonstrate I/O operations (Poll phase)
setTimeout(() => {
  console.log('\n=== I/O OPERATIONS DEMO ===\n');
  
  const fs = require('fs');
  
  // Async file operation
  fs.writeFile('/tmp/test.txt', 'Hello Node.js!', (err) => {
    if (err) throw err;
    console.log('6. I/O: File written');
    
    fs.readFile('/tmp/test.txt', 'utf8', (err, data) => {
      if (err) throw err;
      console.log('7. I/O: File read ->', data);
    });
  });
}, 100);
