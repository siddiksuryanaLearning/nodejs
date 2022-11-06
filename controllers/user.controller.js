const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const ClientError = require('../exceptions/ClientError');
const InvariantError = require('../exceptions/InvariantError');
const { convert_rupiah } = require('../helpers/helper');

class UserController {
  static async register(req, res) {
    try {
      const data = {
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        role: 1,
        balance: null,
      };
      const {id, full_name, email, gender, balance, createdAt} = await User.create(data, {
        returning: true,
      });
      return res.status(201).json({user: {id, full_name, email, gender, balance, createdAt}});
    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        return res.status(422).json({
          status: 'fail',
          errors: error.errors.map(e => e.message)
        })
      }
      if (error.name == 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          status: 'fail',
          errors: error.errors.map(e => e.message)
        })
      }
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        throw new InvariantError('email or password incorrect!');
      }

      if (!comparePassword(password, user.password)) {
        throw new InvariantError('email or password incorrect!');
      }

      return res.status(200).json({
        token: signToken({ id: user.id, email: user.email }),
      });

    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      }
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
    }
  }

  static async update(req, res) {
    try {
      const { email, full_name } = req.body;
      const id = req.params.userId;
      const user = await User.update({ email, full_name }, {
        where: { id }, returning: true, attributes: [
          'id', 'full_name', 'email', 'createdAt', 'updatedAt'
        ]
      });
      return res.status(200).json({
        user: {
          id: user[1][0].id,
          full_name: user[1][0].full_name,
          email: user[1][0].email,
          createdAt: user[1][0].createdAt,
          updatedAt: user[1][0].updatedAt
        }
      });
    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        return res.status(422).json({
          status: 'fail',
          errors: error.errors.map(e => e.message)
        })
      }
      if (error.name == 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          status: 'fail',
          errors: error.errors.map(e => e.message)
        })
      }
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.userId;
      await User.destroy({ where: { id } });
      res.status(200).json({ message: 'Your account has been successfully deleted' })
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
  }

  static async topup(req, res) {
    try {
      const user = await User.findByPk(res.locals.user.id);
      await user.increment('balance', {by: req.body.balance});
      user.reload();
      res.status(200).json({ message: `Your balance has been successfully updated to Rp ${convert_rupiah(user.balance)}` })
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
  }
}

module.exports = UserController;