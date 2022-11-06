const express = require("express");
const app = express();
require('dotenv').config()
const fs = require('fs');
const userRouter = require('./routes/user.route');
const categoryRouter = require('./routes/category.route');
const productRouter = require('./routes/product.route');
const transactionsRouter = require('./routes/transactions.route');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', async (req, res, next) => {
    res.send('Aplikasi ini terdapat seorang admin dan banyak customer, yang memiliki wewenang untuk melakukan proses CRUD terhdapat categoty dan product hanyalah admin asja. Sedangkan customer hanya bisa melakukan proses pembelian product dan melihat data transaksi pembilannya.');
});

app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/transactions', transactionsRouter);


app.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`);
});