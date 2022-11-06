const { User, TransactionHistory } = require("../models");
const ClientError = require("../exceptions/ClientError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthorizationError = require("../exceptions/AuthorizationError");


const authorizationTransaction = async (req, res, next) => {
  try {
    const UserId = +res.locals.user.id
    const transactionId = +req.params.transactionId

    const result = await TransactionHistory.findByPk(transactionId);
    if (!result) {
      throw new NotFoundError('Transaction not found');
    }

    if (result.UserId !== UserId) {
        const user = await User.findByPk(UserId);
        if (user.role !== 0) {
          throw new AuthorizationError('Access Denied...!');
        }
    }

    next();
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message
      });
    }
    console.error(error)
    return res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error'
    });
  }
}

module.exports = authorizationTransaction;