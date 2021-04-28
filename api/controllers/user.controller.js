const pool = require('../../config/database');
const ApiError = require('../error/ApiError');

class UserController {
  async userRegister(req, res) {}
  async userLogin(req, res) {}
  async userInfo(req, res, next) {
    {
      const { id } = req.query;
      if (!id) {
        return next(
          ApiError.UnprocessableEntity({
            field: 'title',
            message: 'Title should contain at least 3 characters',
          })
        );
      }
      res.json({
        message: 'kukibyaki',
      });
    }
  }
  async getUserbyId(req, res, next) {
    try {
      const id = req.params.id;
      pool.query('SELECT * FROM user WHERE id=?', [id], function (err, data) {
        if (err) return console.log(err);
        res.json(data);
      });
    } catch (e) {
      console.log(e);
      next(
        ApiError.badRequest({
          error: e,
        })
      );
    }
  }
}
module.exports = new UserController();
