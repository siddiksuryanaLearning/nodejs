const { User } = require("../models");
const ClientError = require("../exceptions/ClientError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthorizationError = require("../exceptions/AuthorizationError");


const authorizationCategory = async (req, res, next) => {
  try {
    const id = +res.locals.user.id
    const result = await User.findByPk(id);
    if (!result) {
      throw new NotFoundError('user not found');
    }
    if (result.role !== 0) {
      throw new AuthorizationError('Access Denied...!');
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

module.exports = authorizationCategory;