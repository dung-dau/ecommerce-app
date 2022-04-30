import express from 'express';
import { isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//all routes begin with /api/seed/

// creates a new router object to handle requests
// through various end points
const orderRouter = express.Router();

// async means that the function returns a promise
// await means wait until the promise resolves/returns
// .get means that this endpoint is handling a GET request
// .post means that this endpoint is handling a POST request

// expressAsyncHandler is a found in the notation:
// express.get('/', asyncHandler(async (req, res, next) => {
//   const bar = await foo.findAll();
//   res.send(bar)
// }))

// expressAsyncHandler is a short hand form for:
// express.get('/',(req, res, next) => {
//   foo.findAll()
//   .then ( bar => {
//      res.send(bar)
//    } )
//   .catch(next);
// })

// route that handles a post request(submits information) for a new order
// line 45 only runs after lines 35-44 are finished as it is async
orderRouter.post('/', isAuth, expressAsyncHandler(async (req,res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems.map((x) => ({...x, product: x._id})),
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    user: req.user._id,
  });
  const order = await newOrder.save();
  res.status(201).send({message: 'New Order Created', order});
}));

// searches by the Order collection by the user: id key value pair
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id})
    res.send(orders);
  })
)

// searches the Order collection for a document based on ID
// given as a param
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// a put request(updates information) for updating order information
orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }

      const updatedOrder = await order.save();
      res.send({message: 'Order Paid', order: updatedOrder})
    } else {
      res.status(404).send({message: 'Order Not Found'});
    }
  })
)

export default orderRouter;