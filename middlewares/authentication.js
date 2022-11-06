const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");
const ClientError = require("../exceptions/ClientError");
const AuthenticationError = require("../exceptions/AuthenticationError");
const InvariantError = require("../exceptions/InvariantError");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers['token'];
    if (!token) {
      throw new InvariantError('Token needed');
    } else {
      const result = verifyToken(token);
      const user = await User.findByPk(result.id);
      if (user.email == result.email) {
        res.locals.user = result
        return next()
      }
      throw new AuthenticationError('Credential invalid.');
    }
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).json({
        status: 'fail', message: error.message
      })
    }
    console.log(error);
    return res.status(500).json(error)
  }
}

module.exports = authentication;