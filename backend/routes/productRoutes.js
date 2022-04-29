import express from 'express';
import Product from '../models/productModel.js';

//all routes begin with /api/products/

// creates a new router object to handle requests
// through various end points
const productRouter = express.Router();

// async means that the function returns a promise
// await means wait until the promise resolves/returns
// .get means that this endpoint is handling a GET request
productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
})

// :slug is a param of this endpoint
// :slug is accessed through req.o=params.slug
productRouter.get('/slug/:slug/', async (req, res) => {
  const product = await Product.findOne({slug:req.params.slug})
  if(product) {
    res.send(product);
  } else {
    // sends a 404 http status code and sends an object
    // indicating that the product is not found
    res.status(404).send({message: "Product Not Found"})
  }
});

// the :id param would be accessed with req.params.id
productRouter.get('/:id/', async (req, res) => {
  const product = await Product.findById(req.params.id)
  if(product) {
    res.send(product);
  } else {
    res.status(404).send({message: "Product Not Found"})
  }
});

export default productRouter;