import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';

//all routes begin with /api/seed/

// creates a new router object to handle requests
// through various end points
const seedRouter = express.Router();

// async means that the function returns a promise
// await means wait until the promise resolves/returns
// .get means that this endpoint is handling a GET request
seedRouter.get('/', async(req, res) => {
    // Remove all documents in the Product collection
    await Product.remove({});
    // creates a Product collection
    const createdProducts = await Product.insertMany(data.products);
    // sends the HTTP response
    res.send({createdProducts});
})

export default seedRouter;