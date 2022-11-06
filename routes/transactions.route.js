var express = require('express');
var router = express.Router();

const transactionsController = require("../controllers/transactions.controller");
const authentication = require('../middlewares/authentication');
const authorizationAdmin = require('../middlewares/admin.authorization');
const authorizationTransaction = require('../middlewares/transaction.authorization');

router.use(authentication);
router.post('/', transactionsController.create);
router.get('/user', transactionsController.getTransactionUser);
router.get('/admin', authorizationAdmin, transactionsController.getTransactionAdmin);
router.get('/:transactionId', authorizationTransaction, transactionsController.getTransactionById);

module.exports = router;