import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';

// connects node with mongodb
dotenv.config();
mongoose.connect(process.env.MONGODB_URI).then(() => {
    // connected to db
}).catch((err) => {
    console.log(err.message)
});

const app = express();

// the use method is used to configure middleware that is 
// used by the routes 
// middleware are functions that have access to the req and
// res objects and the next middleware function in the 
// application’s request-response cycle

// adds the middleware from ./routes/seedRoutes.js and
// setting /api/seed/ as the first part of the route
app.use('/api/seed/', seedRouter);

// adds the middleware from ./routes/productRoutes.js
//  and setting /api/products as the first part of the
// route
app.use('/api/products', productRouter);

// sets up the server to listen to requests on a certain
// port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`serve at http://local:${port}`)
})