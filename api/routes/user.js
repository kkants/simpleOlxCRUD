const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const awaitHandler = require('../middleware/awaitHandler.middleware');
const {
  registerUserSchema,
  validateLogin,
} = require('../middleware/userValidator.middleware');

const userController = require('../controllers/user.controller');

router.post('/register', registerUserSchema, userController.userRegister);
router.post('/login', validateLogin, userController.userLogin);
router.get('/me', auth(), userController.getCurrentUser);

module.exports = router;
