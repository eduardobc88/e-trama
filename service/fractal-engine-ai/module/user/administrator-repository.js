import MY_SQL_DB from '../../lib/mysqldb.js'
import COMMAND from './administrator-command.js'
import QUERY from './administrator-query.js'


const add = async data => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(COMMAND.create, {
      role_id: data.role_id,
      language_id: data.language_id,
      user_name: data.user_name,
      user_pass: data.user_pass,
      user_email: data.user_email,
      user_first_name: data.user_first_name,
      user_last_name: data.user_last_name,
      user_active: data.user_active,
      user_id: data.user_id,
      position: data.position,
      phone: data.phone,
      file_ids: data.file_ids,
      area_id: data.area_id,
      theme: data.theme,
    })
    response = await find({
      id: result.insertId,
      user_id: data.user_id,
    })
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const find = async (data, userPass = false) => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.get, [
      data.id,
    ])
    if (result.length)
      response.record = result[0]
    if (!userPass)
      response.record.user_pass = ''
    if (response.record.file_ids !== '' && response.record.file_ids !== 'null')
      response.record.file_ids = JSON.parse(response.record.file_ids)
    else
      response.record.file_ids = []
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
    if (data.profile_file_id === 0)
      data.profile_file_id = null
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let query = COMMAND.update
    let values = [
      data.language_id,
      data.profile_file_id,
      'user_pass',
      data.role_id,
      data.user_email,
      data.user_first_name,
      data.user_last_name,
      data.user_name,
      data.position,
      data.phone,
      data.file_ids,
      data.area_id,
      data.theme,
      data.id,
    ]
    if (data.user_pass) {
      query = query.replaceAll('user_pass_replace,', 'user_pass = ?,')
      values[2] = data.user_pass
    } else {
      query = query.replaceAll('user_pass_replace,', '')
      values.splice(2, 1)
    }
    let result = await transaction.query(query, values)
    if (result.affectedRows === 0)
      throw 'no updated'
    await transaction.commit()
    response = await find({
      id: data.id,
    })
  } catch (err) {
    await transaction.rollback()
    response.error = err
  } finally {
    return response
  }
}

const remove = async data => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  let transaction = null
  try {
    if (data.profile_file_id === 0)
      data.profile_file_id = null
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    response = await find({
      id: data.id,
    })
    let [result] = await transaction.query(COMMAND.remove, [
      data.id,
    ])
    if (result.affectedRows === 0)
      throw 'no deleted'
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    response.error = err
  } finally {
    return response
  }
}

const getByUserName = async userName => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.getByUserName, [userName])
    if (result.length)
      response.record = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const list = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetch.replace('sort', data.sort)
    let [result] = await dbConn.query(query, [
      data.limit,
      data.skip,
    ])
    response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const filter = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.search
    let [result] = await dbConn.query(query, [
      `%${ data.search }%`,
      data.limit,
    ])
  response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const findTotal = async data => {
  let response = {
    total: 0,
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.getTotal)
    if (result.length)
      response.total = result[0].total
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const findById = async id => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.getById, [id])
    if (result.length)
      response.record = result[0]
  } catch (err) {
    response.error = err  
  } finally {
    return response
  }
}


export default {
  add: add,
  find: find,
  update: update,
  remove: remove,
  getByUserName: getByUserName,
  list: list,
  filter: filter,
  findTotal: findTotal,
  findById: findById,
}
