'use strict';
const {
  Model
} = require('sequelize');

const { convert_rupiah } = require("../helpers/helper");
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product);
      this.belongsTo(models.User);
    }
  }
  TransactionHistory.init({
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'quantity must be a number.'
        },
        notNull: {
          msg: 'quantity cannot be null.'
        },
        notEmpty: {
          msg: 'quantity cannot be empty.'
        }
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('total_price');
        return convert_rupiah(rawValue);
      },
      validate: {
        isInt: {
          msg: 'quantity must be a number.'
        },
        notNull: {
          msg: 'quantity cannot be null.'
        },
        notEmpty: {
          msg: 'quantity cannot be empty.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};