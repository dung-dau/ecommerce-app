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