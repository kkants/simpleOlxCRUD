const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateJwt = (id, email, name) => {
  return jwt.sign({ id, email, name }, process.env.SECRET_KEY, {
    expiresIn: '5h',
  });
};

class UserController {
  async userRegister(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new HttpException(422, { message: 'Validation failed!', errors }));
      return;
    }
    const { email, password, name } = req.body;
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      next(new HttpException(422, 'Email already exist'));
      return;
    }
    const hashPassword = await bcrypt.hash(password, 4);
    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });
    if (!user) {
      let msg = {
        field: 'current_password',
        message: 'Wrong current password',
      };
      next(new HttpException(422, msg));
      return;
    }
    const msg = 'User was registred!';
    const token = generateJwt(user.id, user.email, user.name);
    return res.json({
      messasge: msg,
      token: token,
    });
  }
  async userLogin(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new HttpException(422, { message: 'Validation failed!', errors }));
      return;
    }
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      let msg = {
        field: 'password',
        message: 'Wrong email or password. User not found',
      };
      next(new HttpException(404, msg));
      return;
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      next(new HttpException(422, 'Wrong password'));
      return;
    }
    const token = generateJwt(user.id, user.email, user.name);
    // const token = process.env.TOKEN;
    return res.json({
      token: token,
    });
  }
  async getCurrentUser(req, res, next) {
    const { password, ...userWithoutPassword } = req.currentUser;

    res.json(userWithoutPassword);
  }
}
module.exports = new UserController();
