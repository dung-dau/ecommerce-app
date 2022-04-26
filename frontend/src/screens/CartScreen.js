import axios from "axios";
import { useContext } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import ListGroup from "react-bootstrap/esm/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Row from "react-bootstrap/esm/Row";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";

export default function CartScreen() {
    const {state, dispatch: cxtDispatch} = useContext(Store);
    const {
        cart: {cartItems},
    } = state;
    const navigate = useNavigate();

    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`);
        if(data.countInStock < quantity) {
            window.alert('Sorry, this product is out of stock');
          }
          cxtDispatch({
            type:'CART_ADD_ITEM',
            payload:{...item, quantity}
          });
    }

    const removeItemHandler = (item) => {
        cxtDispatch({type: 'CART_REMOVE_ITEM', payload: item})
    }

    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
    }

    return (
        <div>
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <h1>Shopping Cart</h1>
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            Cart is empty. <Link to="/">Go Shopping</Link>
                        </MessageBox>
                    ) : (
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroupItem key={item._id}>
                                    <Row className="align-items-center">
                                        <Col md={4}>
                                            <img 
                                              src={item.image}
                                              alt={item.name}
                                              className="img-fluid rounded img-thumbnail"
                                            />{' '}
                                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={3}>
                                            <Button 
                                              variant="light"
                                              onClick = {() => updateCartHandler(item, item.quantity - 1)} 
                                              disabled={item.quantity === 1}
                                            >
                                                <i className="fas fa-minus-circle"></i>
                                            </Button>{' '}
                                            <span>{item.quantity}</span>
                                            <Button 
                                              variant="light" 
                                              onClick = {() => updateCartHandler(item, item.quantity + 1)}
                                              disabled={item.quantity === 1}
                                            >
                                                <i className="fas fa-plus-circle"></i>
                                            </Button>
                                        </Col>
                                        <Col md={3}>${item.price}</Col>
                                        <Col md={2}>
                                            <Button 
                                              variant="light"
                                              onClick={() => removeItemHandler(item)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}
                                        items) : $ {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button 
                                          type="button"
                                          variant="primary"
                                          onClick={checkoutHandler}
                                          disabled={cartItems.length === 0}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    
                </Col>
            </Row>
        </div>
    );
}