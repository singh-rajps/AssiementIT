# Node.js Concurrency & Event Loop Demo

A comprehensive demonstration of how Node.js handles concurrency and the event loop mechanism.

## 📚 What is Node.js?

**Node.js** is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server-side and is designed for building scalable network applications.

### Key Features:
- **Single-threaded** with event-driven architecture
- **Non-blocking I/O** operations
- **Asynchronous** by default
- **Event Loop** for handling concurrency
- **Fast** due to V8 engine compilation

## 🔄 The Event Loop

The event loop is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.

### Event Loop Phases:

```
   ┌───────────────────────────┐
┌─>│           timers          │  setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  I/O callbacks deferred
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  Internal use
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  Retrieve new I/O events
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │      close callbacks      │  socket.on('close', ...)
│  └─────────────┬─────────────┘
└──────────────────────────────┘
```

### Microtask Queue:
Between each phase, Node.js executes the **microtask queue**:
1. **process.nextTick()** - Highest priority
2. **Promise callbacks** - After nextTick

## 🚀 Running the Demos

### 1. Event Loop Basics
```bash
npm run demo:event-loop
```
Shows the basic execution order of different async operations.

### 2. Event Loop Visualization
```bash
npm run demo:visualization
```
Detailed visualization of event loop phases with explanations.

### 3. Concurrency Patterns
```bash
npm run demo:concurrency
```
Demonstrates different patterns:
- Callbacks (traditional)
- Promises (chaining)
- Async/Await (modern)
- Parallel execution (Promise.all)
- Race conditions (Promise.race)
- Error handling (try-catch, Promise.allSettled)

### 4. Worker Threads
```bash
npm run demo:workers
```
Shows how to use worker threads for CPU-intensive tasks.

### 5. Run All Demos
```bash
npm run demo:all
```

## 📖 Concurrency Patterns

### 1. Callbacks (Old Way)
```javascript
fetchUser(1, (err, user) => {
  if (err) return console.error(err);
  fetchPosts(user.id, (err, posts) => {
    if (err) return console.error(err);
    // Callback hell! 😱
  });
});
```

### 2. Promises (Better)
```javascript
fetchUser(1)
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts))
  .catch(err => console.error(err));
```

### 3. Async/Await (Best)
```javascript
async function getData() {
  try {
    const user = await fetchUser(1);
    const posts = await fetchPosts(user.id);
    console.log(posts);
  } catch (err) {
    console.error(err);
  }
}
```

### 4. Parallel Execution
```javascript
// Sequential (slow) - 3 seconds total
const user1 = await fetchUser(1); // 1s
const user2 = await fetchUser(2); // 1s
const user3 = await fetchUser(3); // 1s

// Parallel (fast) - 1 second total
const [user1, user2, user3] = await Promise.all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
]);
```

## 🎯 Key Concepts

### Non-Blocking I/O
```javascript
// ❌ Blocking (synchronous)
const data = fs.readFileSync('file.txt');
console.log(data); // Waits for file to be read

// ✅ Non-blocking (asynchronous)
fs.readFile('file.txt', (err, data) => {
  console.log(data); // Continues execution immediately
});
```

### Event Loop Priority
1. **Synchronous code** - Runs first
2. **process.nextTick()** - Highest async priority
3. **Promise microtasks** - After nextTick
4. **setTimeout/setInterval** - Timer phase
5. **setImmediate** - Check phase
6. **I/O callbacks** - Poll phase

### When to Use What?

| Pattern | Use Case |
|---------|----------|
| **Callbacks** | Legacy code, simple operations |
| **Promises** | Multiple async operations, chaining |
| **Async/Await** | Modern code, readable async logic |
| **Promise.all** | Parallel independent operations |
| **Promise.race** | First response wins (timeouts) |
| **Worker Threads** | CPU-intensive tasks |
| **Child Processes** | Running external programs |

## 🔧 Best Practices

1. **Use async/await** for cleaner code
2. **Avoid blocking the event loop** - no heavy computations in main thread
3. **Use Promise.all** for parallel operations
4. **Handle errors** with try-catch or .catch()
5. **Use worker threads** for CPU-intensive tasks
6. **Avoid process.nextTick** in loops (can starve event loop)
7. **Use setImmediate** over setTimeout(fn, 0)

## 📚 Additional Resources

- [Node.js Event Loop Documentation](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [Understanding the Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [Worker Threads Documentation](https://nodejs.org/api/worker_threads.html)

## 🎓 Learning Path

1. Start with `event-loop-demo.js` - understand execution order
2. Study `event-loop-visualization.js` - see phases in action
3. Practice with `concurrency-patterns.js` - learn different patterns
4. Explore `worker-threads-demo.js` - handle CPU-intensive tasks

---

**Happy Learning! 🚀**
