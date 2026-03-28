import MYSQL2 from 'mysql2'

import SERVICE_CONFIG from '../config.js'


const POOL = MYSQL2.createPool({
  connectionLimit : 20,
  host            : SERVICE_CONFIG.db.host,
  user            : SERVICE_CONFIG.db.user,
  password        : SERVICE_CONFIG.db.password,
  database        : SERVICE_CONFIG.db.db_name,
  debug           : false,
})

const getPoolConnection = () => {
  return POOL.promise()
}


export default {
  getPoolConnection: getPoolConnection,
}