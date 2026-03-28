import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'


const findByToken = async userName => {
  let dbConn = null
  let response = {
    record: {},
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.get, [userName])
    if (result.length)
      response.record = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

export default {
  findByToken: findByToken,
}
