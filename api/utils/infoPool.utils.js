const pool = require('../../config/database');
const ApiError = require('../error/ApiError');

function infoPool(_id, req, res, next) {
  pool.query(
    `SELECT * FROM items JOIN user ON items.user_id=user.id WHERE items.id=?`,
    [_id],
    function (err, data) {
      if (err) return console.log(err);
      if (data.length == 0) {
        return next(ApiError.NotFound('NOT FOUND'));
      }
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

module.exports = infoPool;
