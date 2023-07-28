const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const userPolicyRoutes = require('./routes/userPolicyRoutes');
const userAgentAccountRoutes = require('./routes/userAgentAccountRoutes');
const app = express();
const port = 4500;


app.use(bodyParser.json());


mongoose.connect('mongodb://127.0.0.1:27017/lifeDB');
 



// Routes
app.use('/users', userRoutes);

app.use('/user-policies', userPolicyRoutes);
app.use('/user-agent-accounts', userAgentAccountRoutes);

app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
  });