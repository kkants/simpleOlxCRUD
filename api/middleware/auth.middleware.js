require('dotenv').config();
const e = require('express');
const UserModel = require('../models/user.model');
const HttpExeption = require('../utils/HttpException.utils');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = () => {
  return async function (req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const bearer = 'Bearer';
      if (!authHeader || !authHeader.startsWith(bearer)) {
        throw new HttpExeption(401, 'Unauthorized / Access denied');
      }
      const token = authHeader.replace(bearer, '');
      const secretKey = process.env.SECRET_KEY;
      const decoded = jwt.verify(token, secretKey);
      const user = await UserModel.findOne({ id: decoded.id });
      if (!user) {
        throw new HttpException(401, 'Authentication failed!');
      }
      req.currentUser = user;
      next();
    } catch (e) {
      e.status = 401;
      next(e);
    }
  };
};

module.exports = auth;
