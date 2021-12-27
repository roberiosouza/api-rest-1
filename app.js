const express = require('express');
const app = express();
const routeProducts = require('./routes/products');
const routeOrders = require('./routes/orders');

app.use('/products', routeProducts);
app.use('/orders', routeOrders);

module.exports = app;