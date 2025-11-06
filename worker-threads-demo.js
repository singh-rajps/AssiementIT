/**
 * Worker Threads Demo
 * For CPU-intensive tasks that would block the event loop
 */

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  console.log('=== WORKER THREADS DEMO ===\n');
  console.log('Main thread: Starting CPU-intensive tasks...\n');
  
  // CPU-intensive task (Fibonacci calculation)
  function runWorker(num) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: num
      });
      
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
  
  // Run multiple workers in parallel
  async function main() {
    const start = Date.now();
    
    // These run in parallel on separate threads
    const results = await Promise.all([
      runWorker(40),
      runWorker(41),
      runWorker(42),
      runWorker(43)
    ]);
    
    const duration = Date.now() - start;
    
    console.log('\nResults:');
    results.forEach((result, i) => {
      console.log(`  Worker ${i + 1}: fibonacci(${result.input}) = ${result.result}`);
    });
    
    console.log(`\nTotal time: ${duration}ms`);
    console.log('\nNote: Without worker threads, these would run sequentially');
    console.log('and block the event loop, making the app unresponsive!\n');
  }
  
  main().catch(console.error);
  
} else {
  // Worker thread code
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  
  const result = fibonacci(workerData);
  parentPort.postMessage({ input: workerData, result });
}
