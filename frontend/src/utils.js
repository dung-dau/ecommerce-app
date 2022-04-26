export const getError = (error) => {
    // error.response.data.message refers to the object
    // that contains the object with the message: 'Product Not Found'
    // key value pair from server.js
    return error.response && error.response.data.message
    ? error.response.data.message 
    : error.message;
}