import mongoose from 'mongoose';

// defines the schema for product
const productSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        slug: {type: String, required: true, unique: true},
        image: {type: String, required: true},
        brand: {type: String, required: true},
        category: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        countInStock: {type: Number, required: true},
        rating: {type: Number, required: true},
        numReviews: {type: Number, required: true},
    },
    {
        timestamps: true
    }
);

// creates a collection named Product with productSchema
const Product = mongoose.model('Product', productSchema);

export default Product;