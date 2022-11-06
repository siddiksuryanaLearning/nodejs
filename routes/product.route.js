var express = require('express');
var router = express.Router();

const ProductController = require("../controllers/product.controller");
const authentication = require('../middlewares/authentication');
const authorizationAdmin = require('../middlewares/admin.authorization');

router.use(authentication);
router.post('/',authorizationAdmin, ProductController.create)
router.get('/', ProductController.getAll)
router.put('/:productId',authorizationAdmin, ProductController.updatePut);
router.patch('/:productId',authorizationAdmin, ProductController.updatePatch);
router.delete('/:productId',authorizationAdmin, ProductController.delete);

module.exports = router;