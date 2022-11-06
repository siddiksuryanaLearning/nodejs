var express = require('express');
var router = express.Router();

const UserController = require("../controllers/user.controller");
const authentication = require('../middlewares/authentication');
const authorizationUser = require('../middlewares/user.authorization');

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.use(authentication);
router.put('/:userId', authorizationUser, UserController.update);
router.patch('/topup', UserController.topup);
router.delete('/:userId', authorizationUser, UserController.delete);

module.exports = router;