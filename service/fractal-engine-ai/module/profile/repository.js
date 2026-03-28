import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'
import COMMAND from './command.js'


const find = async id => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.get, [id])
    if (result.length)
      response.record = result[0]
    result = []
    [result] = await dbConn.query(QUERY.fetchResources, [response.record.role_id])
    response.record.role_resources = result[0]
    if (response.record.file_ids !== '' && response.record.file_ids !== 'null')
      response.record.file_ids = JSON.parse(response.record.file_ids)
    else
      response.record.file_ids = []
    return response
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
    if (data.profile_file_id === 0)
      data.profile_file_id = null
    let values = [
      data.language_id,
      data.profile_file_id,
      'user_pass',
      data.user_email,
      data.user_first_name,
      data.user_last_name,
      data.position,
      data.phone,
      data.theme,
      data.file_ids,
      data.id,
    ]
    let query = COMMAND.update
    if (data.user_pass) {
      query = query.replaceAll('user_pass_replace,', 'user_pass = ?,')
      values[2] = data.user_pass
    } else {
      query = query.replaceAll('user_pass_replace,', '')
      values.splice(2, 1)
    }
    await transaction.query(query, values)
    response = await find(data.id)
    await transaction.commit()
  } catch (err) {
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
