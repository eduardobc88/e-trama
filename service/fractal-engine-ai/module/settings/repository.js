import MY_SQL_DB from '../../lib/mysqldb.js'
import COMMAND from './command.js'
import QUERY from './query.js'


const find = async () => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.get, [])
    if (result.length)
      response.record = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const update = async data => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  let transaction = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    await transaction.query(COMMAND.update, [
      data.use_google_drive,
      data.gd_folder_id,
      data.gd_auth_client_email,
      data.gd_auth_private_key,
      data.items_by_page,
      data.id,
    ])
    await transaction.commit()
    response = await find()
  } catch (err) {
    await transaction.rollback()
    response.error = err
  } finally {
    transaction.release()
    return response
  }
}


export default {
  find: find,
  update: update,
}
