/**
 * Event Loop Visualization
 * Shows the order of execution in detail
 */

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║         NODE.JS EVENT LOOP VISUALIZATION                  ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

let step = 1;

function log(phase, message) {
  console.log(`[${step++}] ${phase.padEnd(20)} │ ${message}`);
}

// ============================================
// EXECUTION ORDER DEMONSTRATION
// ============================================

log('SYNC', 'Script starts');

// Macrotasks (Event Loop phases)
setTimeout(() => log('TIMER (0ms)', 'setTimeout 0ms'), 0);
setTimeout(() => log('TIMER (10ms)', 'setTimeout 10ms'), 10);

setImmediate(() => log('CHECK', 'setImmediate 1'));
setImmediate(() => log('CHECK', 'setImmediate 2'));

// Microtasks (executed between phases)
Promise.resolve().then(() => log('MICROTASK', 'Promise 1'))
  .then(() => log('MICROTASK', 'Promise 1 chained'));

Promise.resolve().then(() => log('MICROTASK', 'Promise 2'));

process.nextTick(() => log('MICROTASK', 'nextTick 1'));
process.nextTick(() => log('MICROTASK', 'nextTick 2'));

// I/O operations
const fs = require('fs');
fs.writeFile('/tmp/demo.txt', 'test', () => {
  log('POLL (I/O)', 'File write complete');
  
  // Microtasks after I/O
  process.nextTick(() => log('MICROTASK', 'nextTick after I/O'));
  Promise.resolve().then(() => log('MICROTASK', 'Promise after I/O'));
  
  setImmediate(() => log('CHECK', 'setImmediate after I/O'));
});

log('SYNC', 'Script ends');

// ============================================
// DETAILED EXPLANATION
// ============================================
setTimeout(() => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    EXPLANATION                             ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log('Event Loop Phases (in order):');
  console.log('  1. TIMERS       → setTimeout, setInterval callbacks');
  console.log('  2. PENDING      → I/O callbacks from previous cycle');
  console.log('  3. IDLE/PREPARE → Internal operations');
  console.log('  4. POLL         → Retrieve new I/O events');
  console.log('  5. CHECK        → setImmediate callbacks');
  console.log('  6. CLOSE        → Close event callbacks\n');
  
  console.log('Microtask Queue (runs BETWEEN each phase):');
  console.log('  • process.nextTick() - Highest priority');
  console.log('  • Promise callbacks  - After nextTick\n');
  
  console.log('Key Principles:');
  console.log('  ✓ Synchronous code runs first');
  console.log('  ✓ Microtasks run between event loop phases');
  console.log('  ✓ process.nextTick has highest priority');
  console.log('  ✓ setImmediate runs in CHECK phase');
  console.log('  ✓ setTimeout runs in TIMERS phase');
  console.log('  ✓ I/O callbacks run in POLL phase\n');
}, 200);
