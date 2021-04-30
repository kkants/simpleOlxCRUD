const mysql2 = require('mysql2');
const HttpException = require('../api/utils/HttpException.utils');
require('dotenv').config();

class DBConnection {
  constructor() {
    this.db = mysql2.createPool({
      connectionLimit: 10,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.MYSQL_DB,
    });
    this.checkConnection();
  }
  checkConnection() {
    this.db.getConnection((err, connection) => {
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
          console.error('Database connection was refused.');
        }
        if (err.code === 'ER_DUP_ENTRY') {
          console.error('Duplicate email');
        }
        console.log(err);
      }
      if (connection) {
        connection.release();
      }
      return;
    });
  }
  query = async (sql, values) => {
    return new Promise((resolve, reject) => {
      const callback = (error, result) => {
        if (error) {
          console.log(error);
        }
        resolve(result);
      };
      this.db.execute(sql, values, callback);
    }).catch((err) => {
      console.log(err);
    });
  };
}

module.exports = new DBConnection().query;
