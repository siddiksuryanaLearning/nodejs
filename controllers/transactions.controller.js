const { Category, Product, TransactionHistory, User } = require('../models');
const ClientError = require('../exceptions/ClientError');
const InvariantError = require('../exceptions/InvariantError');
const { convert_rupiah } = require("../helpers/helper");

class transactionsController {
    static async create(req, res) {
        try {
            const UserId = +res.locals.user.id
            const productId = +req.body.productId
            const quantity = +req.body.quantity

            const product = await Product.findOne({ where: { id: productId } });
            if (!product) {
                throw new InvariantError('Product not found !');
            }

            if ((product.stock - 5) < quantity) {
                throw new InvariantError('Quantity exceeds stock limit !');
            }

            const hargaProduct = product.price * quantity

            const user = await User.findOne({ where: { id: UserId } });
            if (user.balance < hargaProduct) {
                throw new InvariantError('Balance is not enough !');
            }

            const category = await Category.findOne({ where: { id: product.CategoryId } });

            await product.decrement('stock', {by: quantity});
            await user.decrement('balance', {by: hargaProduct});
            await category.increment('sold_product_amount', {by: quantity});

            await TransactionHistory.create({
                ProductId: productId,
                quantity: quantity,
                UserId: UserId,
                total_price: hargaProduct,
            });

            const dataView = {
                message: "You have successful purchase the product",
                transactionBill: {
                    total_price: convert_rupiah(hargaProduct),
                    quantity: quantity,
                    product_name: product.title
                }
            }
            res.status(201).json(dataView);
        } catch (error) {
            if (error instanceof ClientError) {
                return res.status(error.statusCode).json({ status: 'fail', message: error.message });
            }
            console.error(error);
            res.status(500).json({ status: 'fail', message: 'Internal server error' });
        }
    }

    static async getTransactionUser(req, res) {
        try {
            const UserId = res.locals.user.id
            const TransactionHistories = await TransactionHistory.findAll({
                where: { UserId: UserId },
                attributes: ['ProductId', 'UserId', 'quantity', 'total_price', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
                    }
                ]
            });
            return res.status(200).json({ TransactionHistories })
        } catch (error) {
            res.status(500).json({ status: 'fail', message: error.message });
        }
    }

    static async getTransactionAdmin(req, res) {
        try {
            const TransactionHistories = await TransactionHistory.findAll({
                attributes: ['ProductId', 'UserId', 'quantity', 'total_price', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
                    },
                    {
                        model: User,
                        attributes: ['id', 'email', 'balance', 'gender', 'role']
                    }
                ]
            });
            return res.status(200).json({ TransactionHistories })
        } catch (error) {
            res.status(500).json({ status: 'fail', message: error.message });
        }
    }

    static async getTransactionById(req, res) {
        try {
            const id = +req.params.transactionId;
            const TransactionHistories = await TransactionHistory.findOne({
                where: { id: id },
                attributes: ['ProductId', 'UserId', 'quantity', 'total_price', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
                    }
                ]
            });
            return res.status(200).json(TransactionHistories)
        } catch (error) {
            res.status(500).json({ status: 'fail', message: error.message });
        }
    }

}

module.exports = transactionsController;