const { User } = require("../models");
const ClientError = require("../exceptions/ClientError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthorizationError = require("../exceptions/AuthorizationError");


const authorizationUser = async (req, res, next) => {
  try {
    const id = res.locals.user.id
    const userId = req.params.userId
    const result = await User.findByPk(userId);
    if (!result) {
      throw new NotFoundError('user not found');
    }

    if (result.id !== id) {
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

module.exports = authorizationUser;