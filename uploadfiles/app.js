
// app.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const { connectToDatabase, getDatabase } = require('./db');

const app = express();
const port = 4000;

// Set up file upload using Multer
const upload = multer({ dest: 'uploads/' });

// Middleware to handle file upload
app.post('/upload', upload.single('csvFile.csv'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No CSV file provided.' });
  }

  const csvData = [];
  fs.createReadStream(file.path)
    .pipe(csvParser())
    .on('data', (row) => {
      csvData.push(row);
    })
    .on('end', () => {
      // Save data to MongoDB
      const db = getDatabase();
      const collection = db.collection('csv_data');
      collection.insertMany(csvData, (err, result) => {
        if (err) {
          console.error('Error saving data to MongoDB:', err);
          return res.status(500).json({ error: 'Error saving data to database.' });
        }
        console.log('Data saved to MongoDB.');
        res.status(200).json({ message: 'CSV data uploaded successfully.' });
      });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  connectToDatabase();
});
