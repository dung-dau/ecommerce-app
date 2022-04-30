import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Badge from 'react-bootstrap/esm/Badge';
import Card from 'react-bootstrap/esm/Card';
import Button from 'react-bootstrap/esm/Button';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { useNavigate, useParams } from 'react-router-dom';
import Rating from '../components/Rating';
// used to change the title that is displayed on the tab
import { Helmet } from 'react-helmet-async';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true}
    case 'FETCH_SUCCESS':
      return {...state, product: action.payload, loading: false}
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
}

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const {slug} = params;

  const [{loading, error, product}, dispatch] = useReducer(reducer, {
    product: [],
    loading: true, 
    error: '',
  })

  // fetches data in the form:
  // {
  //   "_id": "",
  //   "name": "",
  //   "slug": "",
  //   "image": "",
  //   "brand": "",
  //   "category": "",
  //   "description": "",
  //   "price": num,
  //   "countInStock": num,
  //   "rating": num,
  //   "numReviews": num,
  //   "__v": 0,
  //   "createdAt": "2022-04-28T21:48:09.826Z",
  //   "updatedAt": "2022-04-28T21:48:09.826Z"
  // }
  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'});
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({type: 'FETCH_SUCCESS', payload: result.data});
      } catch(err) {
        dispatch({type: 'FETCH_FAIL', payload: getError(err)});
      }
    }
    fetchData();
  }, [slug])

  const {state, dispatch: cxtDispatch} = useContext(Store);
  const {cart} = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if(data.countInStock < quantity) {
      window.alert('Sorry, this product is out of stock');
    }
    cxtDispatch({
      type:'CART_ADD_ITEM',
      payload:{...product, quantity}
    });
    navigate('/cart');
  }

  return (
    loading ? (
      <div>Loading...</div>
    ) : error ? (
      <MessageBox variant="danger">{error}</MessageBox>
    ) : (
      <div>
        <Row>
          <Col md={6}>
            <img
              className="img-large"
              src={product.image}
              alt={product.name}
            ></img>
          </Col>
          <Col md={3}>
            {/* flush variant removes outer borders */}
            <ListGroup variant="flush">
              <ListGroup.Item>
                {/* 
                    Use the react-helmet-async library by wrapping the desired
                    title in Helmet tags
                 */}
                <Helmet>
                  {/* to set the title, the title must be wrapped in the title tags */}
                  <title>{product.name}</title>
                </Helmet>
                <h1>{product.name}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description:
                <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              {/* sets the main content of the card */}
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>${product.price}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Unavailable</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button onClick={addToCartHandler} variant="primary">Add to Cart</Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    )
 
  );
}

export default ProductScreen