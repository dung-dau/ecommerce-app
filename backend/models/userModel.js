import mongoose from 'mongoose';

// defines the schema for user
const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false, required: true},
    },
    {
        timestamps: true
    }
);

// creates a collection named user with userSchema
const User = mongoose.model('User', userSchema);

export default User;