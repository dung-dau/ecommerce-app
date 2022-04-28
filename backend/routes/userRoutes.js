import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const userRouter = express.Router();

userRouter.post(
  '/signin', expressAsyncHandler(async(req, res) => {
    const user = await User.findOne({email:req.body.email});
    // if the mentioned user exists
    if(user) {
      // checks if the password entered matches the one in the database
      if(bcrypt.compareSync(req.body.password, user.password)) {
        // sends the user's information
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user)
        });
        return;
      }
    }
    res.status(401).send({message: 'Invalid email or password'})
  })
);

userRouter.post('/signup', expressAsyncHandler(async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });
  const user = await newUser.save();
  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user)
  });
}));

export default userRouter;