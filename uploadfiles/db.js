// db.js
const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb://127.0.0.1:27017'; // Update this with your MongoDB connection string
const dbName = 'csv_db'; // Update this with your desired database name

let db;

async function connectToDatabase() {
  const client = await MongoClient.connect(mongoURI, { useUnifiedTopology: true });
  db = client.db(dbName);
  console.log('Connected to MongoDB');
}

function getDatabase() {
  return db;
}

module.exports = {
  connectToDatabase,
  getDatabase,
};
