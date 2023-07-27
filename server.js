const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = 4500;


app.use(bodyParser.json());


// Routes
app.use('/users', userRoutes);



app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
  });