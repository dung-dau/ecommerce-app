import jwt from "jsonwebtoken"

export const generateToken = (user) => {
  return jwt.sign(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false, required: true},
  }, 
  process.env.JWT_SECRET, 
  {
    expiresIn: '30d',
  });
}

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if(authorization) {
    // authorization format: Bearer XXXXXX
    // so slice gets rid of the Bearer part
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decode) => {
        if(err) {
          res.status(401).send({message: 'Invalid Token'});
        } else {
          req.user = decode;
          next();
        }
      }
    )
  } else {
    res.status(401).send({message: 'No Token'});
  }
}