const query = require('../../config/database');
const { multipleColumnSet } = require('../utils/common.utils');

class ItemModel {
  tableName = 'items';

  create = async (title, price, user_id, created_at) => {
    const sql = `INSERT INTO ${this.tableName}
     (title,price,user_id,created_at) VALUES (?,?,?,?)`;
    console.log(sql);
    console.log(title, price, user_id, created_at);
    const result = await query(sql, [title, price, user_id, created_at]);
    return result;
  };

  addImg = async (id, fileName) => {
    const sql = `UPDATE ${this.tableName} SET img=?
    WHERE item_id=?`;
    const result = await query(sql, [fileName, id]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName} JOIN user ON items.user_id=user.id`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += `WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);
    const sql = `SELECT * FROM ${this.tableName} JOIN user ON items.user_id=user.id
    WHERE items.${columnSet}`;
    const result = await query(sql, [...values]);
    return result[0];
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);
    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE item_id=?`;
    const result = await query(sql, [...values, id]);
    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
    WHERE item_id=?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };
}

module.exports = new ItemModel();
