const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 4500;


app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
  });