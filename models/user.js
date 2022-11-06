'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.TransactionHistory);
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'full_name cannot be empty.',
        },
        notNull: {
          msg: 'full_name cannot be null.',
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'email already exists'
      },
      validate: {
        isEmail: {
          msg: 'email not valid'
        },
        notEmpty: {
          msg: 'email cannot be empty.'
        },
        notNull: {
          msg: 'email cannot be null.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'password cannot be empty.'
        },
        notNull: {
          msg: 'password cannot be null.'
        },
        len: {
          args: [6, 10],
          msg: 'password must be at least 4 character and most 10 characters'
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'gender cannot be empty.'
        },
        notNull: {
          msg: 'gender cannot be null.'
        },
        isIn: [['male', 'female']]
      }
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'role cannot be empty.'
        },
        notNull: {
          msg: 'role cannot be null.'
        },
        isIn: [[0, 1]] // 0 = admin; 1 = customer
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'balance only accept integer'
        },
        min: 0,
        max: 100000000,
        notEmpty: {
          msg: 'Balance cannot be empty.'
        },
        notNull: {
          msg: 'Balance cannot be null.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, options) => {
        const hashedPassword = hashPassword(user.password)
        user.password = hashedPassword;
        user.balance = 0;
      }
    }
  });
  return User;
};