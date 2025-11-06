/**
 * Node.js Concurrency Patterns
 * Demonstrates different ways to handle concurrent operations
 */

// Simulated async operations
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `User${id}`, email: `user${id}@example.com` });
    }, Math.random() * 1000);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Post 1', userId },
        { id: 2, title: 'Post 2', userId }
      ]);
    }, Math.random() * 1000);
  });
}

function fetchComments(postId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, text: 'Great post!', postId },
        { id: 2, text: 'Thanks for sharing', postId }
      ]);
    }, Math.random() * 1000);
  });
}

// ============================================
// 1. CALLBACKS (Traditional - Callback Hell)
// ============================================
console.log('=== 1. CALLBACKS PATTERN ===\n');

function getDataWithCallbacks(userId, callback) {
  fetchUser(userId).then(user => {
    console.log('Callback: Got user', user.name);
    fetchPosts(user.id).then(posts => {
      console.log('Callback: Got posts', posts.length);
      fetchComments(posts[0].id).then(comments => {
        console.log('Callback: Got comments', comments.length);
        callback(null, { user, posts, comments });
      });
    });
  });
}

getDataWithCallbacks(1, (err, data) => {
  if (err) console.error(err);
  console.log('Callback: Complete!\n');
});

// ============================================
// 2. PROMISES (Better chaining)
// ============================================
setTimeout(() => {
  console.log('=== 2. PROMISES PATTERN ===\n');
  
  fetchUser(2)
    .then(user => {
      console.log('Promise: Got user', user.name);
      return fetchPosts(user.id);
    })
    .then(posts => {
      console.log('Promise: Got posts', posts.length);
      return fetchComments(posts[0].id);
    })
    .then(comments => {
      console.log('Promise: Got comments', comments.length);
      console.log('Promise: Complete!\n');
    })
    .catch(err => console.error('Promise error:', err));
}, 2000);

// ============================================
// 3. ASYNC/AWAIT (Most readable)
// ============================================
setTimeout(async () => {
  console.log('=== 3. ASYNC/AWAIT PATTERN ===\n');
  
  try {
    const user = await fetchUser(3);
    console.log('Async/Await: Got user', user.name);
    
    const posts = await fetchPosts(user.id);
    console.log('Async/Await: Got posts', posts.length);
    
    const comments = await fetchComments(posts[0].id);
    console.log('Async/Await: Got comments', comments.length);
    console.log('Async/Await: Complete!\n');
  } catch (err) {
    console.error('Async/Await error:', err);
  }
}, 4000);

// ============================================
// 4. PARALLEL EXECUTION (Promise.all)
// ============================================
setTimeout(async () => {
  console.log('=== 4. PARALLEL EXECUTION ===\n');
  
  const start = Date.now();
  
  // Sequential (slow)
  console.log('Sequential execution:');
  const user1 = await fetchUser(1);
  const user2 = await fetchUser(2);
  const user3 = await fetchUser(3);
  console.log(`Sequential took: ${Date.now() - start}ms\n`);
  
  // Parallel (fast)
  console.log('Parallel execution:');
  const startParallel = Date.now();
  const [userA, userB, userC] = await Promise.all([
    fetchUser(4),
    fetchUser(5),
    fetchUser(6)
  ]);
  console.log(`Parallel took: ${Date.now() - startParallel}ms`);
  console.log('Parallel: Complete!\n');
}, 6000);

// ============================================
// 5. RACE CONDITIONS (Promise.race)
// ============================================
setTimeout(async () => {
  console.log('=== 5. PROMISE.RACE (First to complete wins) ===\n');
  
  const fastest = await Promise.race([
    fetchUser(7),
    fetchUser(8),
    fetchUser(9)
  ]);
  
  console.log('Race winner:', fastest.name);
  console.log('Race: Complete!\n');
}, 9000);

// ============================================
// 6. ERROR HANDLING
// ============================================
setTimeout(async () => {
  console.log('=== 6. ERROR HANDLING ===\n');
  
  function failingOperation() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Operation failed!')), 100);
    });
  }
  
  // Try-catch with async/await
  try {
    await failingOperation();
  } catch (err) {
    console.log('Caught error:', err.message);
  }
  
  // Promise.allSettled (doesn't fail on errors)
  const results = await Promise.allSettled([
    fetchUser(10),
    failingOperation(),
    fetchUser(11)
  ]);
  
  console.log('\nPromise.allSettled results:');
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      console.log(`  ${i}: Success -`, result.value.name || result.value);
    } else {
      console.log(`  ${i}: Failed -`, result.reason.message);
    }
  });
  
  console.log('\nError handling: Complete!\n');
}, 11000);
