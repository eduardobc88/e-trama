const mysql = require('mysql2')

const APP_CONFIG = require('../config')


const POOL = mysql.createPool({
  connectionLimit : 10,
  host            : APP_CONFIG.DB.host,
  user            : APP_CONFIG.DB.user,
  password        : APP_CONFIG.DB.password,
  database        : APP_CONFIG.DB.db_name,
  debug           : false,
})

exports.getPoolConnection = () => {
  return POOL.promise()
}
