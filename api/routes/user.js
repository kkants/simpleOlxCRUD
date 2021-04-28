const express = require('express');
const router = express.Router();

const checkAuth = '';
const userController = require('../controllers/user.controller');

router.get('/:id', userController.getUserbyId);
router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.get('/me', userController.userInfo);

module.exports = router;
