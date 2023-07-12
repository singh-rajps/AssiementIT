const express =  require('express')
const bodyParser = require('body-parser');
 
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());



//Set up default mongoose connection
mongoose.connect('mongodb://localhost:27017/productsDB', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));


const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String
  });
  
  const Product = mongoose.model('Product', productSchema);
  

// Create a new product
app.post('/api/products', (req, res) => {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    });
  
    product.save()
      .then(() => res.send('Product created successfully'))
      .catch(err => res.status(400).send(err.message));
  });


const port = 4300; // or any port of your choice
app.listen(port, () => console.log(`Server is listening on port ${port}`));
