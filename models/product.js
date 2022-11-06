'use strict';
const {
  Model
} = require('sequelize');

const { convert_rupiah } = require("../helpers/helper");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Category);
    }
  }
  Product.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'title cannot be empty.'
        },
        notNull: {
          msg: 'title cannot be null.'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'price must be number.'
        },
        min: 0,
        max: 50000000,
        notNull: {
          msg: 'price cannot be null.'
        },
        notEmpty: {
          msg: 'price cannot be empty.'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'stokc must be number.'
        },
        notNull: {
          msg: 'stock cannot be null.'
        },
        notEmpty: {
          msg: 'stock cannot be empty.'
        },
        min: 5
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};