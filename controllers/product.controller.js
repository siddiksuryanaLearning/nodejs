const { Category, Product } = require('../models');
const ClientError = require('../exceptions/ClientError');
const InvariantError = require('../exceptions/InvariantError');

class ProductController {
  static async create(req, res) {
    try {
        const product = await Product.create(req.body , { returning: true });
        res.status(201).json({ product });
    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        return res.status(422).json({
          status: 'fail',
          errors: error.errors.map(e => e.message)
        })
      }
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
  }

  static async getAll(req, res) {
    try {
        const products = await Product.findAll();
        return res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
  }

  static async updatePut(req, res) {
    try {
      const id = +req.params.productId;
      const produk = await Product.update(req.body, { where: { id }, returning: true });
      res.status(200).json({ product: produk[1][0] });
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

  static async updatePatch(req, res) {
    try {
      const id = +req.params.productId;
      const CategoryId = +req.body.CategoryId
      const category = await Category.findOne({ where: { id: CategoryId } });

      if (!category) {
        throw new InvariantError('CategoryId not found !');
      }

      const produk = await Product.update({ CategoryId: CategoryId }, { where: { id }, returning: true });
      res.status(200).json({ Products: produk[1][0] });
    } catch (error) {
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({ status: 'fail', message: error.message });
        }
        console.error(error);
        res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
  }

  static async delete(req, res) {
    try {
      const id = +req.params.productId;
      await Product.destroy({ where: { id } });
      res.status(200).json({ message: 'Product has been successfully deleted' })
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
  }
}

module.exports = ProductController;