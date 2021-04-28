const pool = require('../../config/database');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const infoPool = require('../utils/infoPool.utils');

class ItemsController {
  async createItem(req, res, next) {
    try {
      const { title, price } = req.body;
      const { img } = req.files;

      console.log(img);
      console.log(title, price, user_id);
      let timestamp = Date.now();
      const created_at = Math.floor(timestamp / 1000);
      console.log(created_at);
      let fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));
      console.log(fileName);
      console.log('00000000000000000000000000000000000000');
      pool.query(
        `INSERT INTO items (title, price, user_id, img, created_at) values (?,?,?,?,?)`,
        [title, price, user_id, fileName, created_at],
        function (err, data) {
          if (err) return console.log(err);
          res.json({});
          console.log(data);
        }
      );
    } catch (e) {
      console.log(e);
      return next(
        ApiError.UnprocessableEntity({
          field: 'title',
          message: 'Title is required',
          error: e,
        })
      );
    }
  }

  async getItems(req, res, next) {
    try {
      pool.query('SELECT * FROM items', function (err, data) {
        if (err) return console.log(err);
        res.json(data);
      });
    } catch (e) {
      console.log(e);
      return next(
        ApiError.badRequest({
          error: e,
        })
      );
    }
  }

  async getItemById(req, res, next) {
    try {
      const _id = req.params.id;
      if (!_id) return next(ApiError.badRequest('wrong id'));
      await infoPool(_id, req, res, next);
    } catch (e) {
      console.log(e);
      return next(
        ApiError.badRequest({
          error: e,
        })
      );
    }
  }
  async updateItemById(req, res) {
    try {
      const _id = req.params.id;
      const { title, price } = req.body;
      if (!_id) return next(new ApiError.badRequest('id is empty'));
      if (title.length < 3)
        return next(
          new ApiError.UnprocessableEntity({
            field: 'title',
            message: 'Title should contain at least 3 characters',
          })
        );
      pool.query(
        'UPDATE items set title =?, price =? WHERE id=?',
        [title, price, _id],
        function (err, data) {
          if (err) return console.log(err);
          if (data.length == 0) {
            return next(ApiError.NotFound('NOT FOUND'));
          }
          pool.query(
            `SELECT * FROM items JOIN user ON items.user_id=user.id WHERE items.id=?`,
            [_id],
            function (err, data) {
              if (err) return console.log(err);
              if (data.length == 0) {
                return next(ApiError.NotFound('NOT FOUND'));
              }
              console.log(data[0]);
              res.json({
                id: data[0].id,
                created_at: data[0].created_at,
                price: data[0].price,
                image: data[0].img,
                user_id: data[0].user_id,
                user: {
                  id: data[0].user_id,
                  name: data[0].name,
                  password: data[0].password,
                  email: data[0].email,
                },
              });
            }
          );
        }
      );
    } catch (e) {
      console.log(e);
      next(ApiError.NotFound());
    }
  }
  async deleteItemById(req, res) {
    try {
      const _id = req.params.id;
      if (!_id) return next(ApiError.badRequest('wrong id'));
      pool.query(' DELETE FROM items where id =?', [_id], function (err, data) {
        if (err) return next(ApiError.Internal(''));
        if (data.length == 0) {
          return next(ApiError.NotFound('NOT FOUND'));
        }
      });
    } catch (e) {
      return next(
        ApiError.badRequest({
          error: e,
        })
      );
    }
  }
  async addItemImgbyId(req, res) {}
}

module.exports = new ItemsController();
