import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';

function Product({product}) {
  return (
    <Card className="product" key={product.slug}>
        <Link to={`/product/${product.slug}`}>
            <img src={product.image} className="card-img-top" alt={product.name} />
        </Link>
        <Card.Body>
            <Link to={`/product/${product.slug}`}>
                <Card.Title>{product.name}</Card.Title>
            </Link>
            <Rating rating={product.rating} numReviews={product.numReviews} />
            <Card.Text>${product.price}</Card.Text>
            <Button>Add to cart</Button>
        </Card.Body>
    </Card>
  )
}

export default Product