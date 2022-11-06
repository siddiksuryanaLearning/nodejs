const { Category, Product } = require('../models');
const ClientError = require("../exceptions/ClientError");
const NotFoundError = require("../exceptions/NotFoundError");
class CategoryController {
  static async create(req, res) {
    try {
      const category = await Category.create({ type: req.body.type }, { returning: true });
      res.status(201).json({ category });
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

  static async getCategories(req, res) {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
          as: 'Products',
        }
      ]
    });
    return res.status(200).json({ categories })
  }

  static async update(req, res) {
    try {
      const id = +req.params.categoryId;
      const category = await Category.findByPk(id);
      if(!category) {
        throw new NotFoundError('Category not found.');
      }
      await category.update({ type: req.body.type }, { where: { id }, returning: true });
      res.status(200).json({ category: category[1][0] });
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
      if(error instanceof ClientError) {
        return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      }
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
  }

  static async delete(req, res) {
    try {
      const id = +req.params.categoryId;
      await Category.destroy({ where: { id } });
      res.status(200).json({ message: 'Category has been successfully deleted' })
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
  }
}

module.exports = CategoryController;