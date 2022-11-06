var express = require('express');
var router = express.Router();

const CategoryController = require("../controllers/category.controller");
const authentication = require('../middlewares/authentication');
const authorizationAdmin = require('../middlewares/admin.authorization');

router.use(authentication, authorizationAdmin);
router.post('/', CategoryController.create)
router.get('/', CategoryController.getCategories)
router.patch('/:categoryId', CategoryController.update);
router.delete('/:categoryId', CategoryController.delete);

module.exports = router;