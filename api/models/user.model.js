const query = require('../../config/database');
const { multipleColumnSet } = require('../utils/common.utils');

class UserModel {
  tableName = 'user';
  create = async ({ name, email, password }) => {
    const sql = `INSERT INTO ${this.tableName}
     (name,email,password) VALUES (?,?,?)`;
    const result = await query(sql, [name, email, password]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName} WHERE id=1`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += `WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);
    const sql = `SELECT * FROM ${this.tableName}
    WHERE ${columnSet}`;
    const result = await query(sql, [...values]);
    return result[0];
  };
}

module.exports = new UserModel();
