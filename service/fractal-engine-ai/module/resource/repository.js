import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'
import COMMAND from './command.js'


const add = async data => {
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
    let [result] = await transaction.query(COMMAND.create, {
      name: data.name,
      description: data.description,
      path: data.path,
      menu: data.menu,
      records: data.records,
      icon: data.icon,
    })
    await transaction.commit()
    response = await find(result.insertId)
  } catch (err) {
    response.error = err
    await transaction.rollback()
  } finally {
    transaction.release()
    return response
  }
}

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
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const update = async params => {
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
    let [result] = await transaction.query(COMMAND.update, [
      params.name,
      params.description,
      params.path,
      params.menu,
      params.records,
      params.icon,
      params.id,
    ])
    if (result.changedRows === 0)
      throw 'no updated'
    await transaction.commit()
    response = await find(params.id)
  } catch (err) {
    response.error = err
    await transaction.rollback()
  } finally {
    transaction.release()
    return response
  }
}

const remove = async params => {
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
    if (params.resource_profile_file_id === 0)
      params.resource_profile_file_id = null
    response = await find(params.id)
    let [result] = await transaction.query(COMMAND.archive, [
      params.id,
    ])
    if (result.changedRows === 0)
      throw 'no deleted'
    await transaction.commit()
  } catch (err) {
    response.error = err
    await transaction.rollback()
  } finally {
    transaction.release()
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
    let query = QUERY.fetch
    query = query.replace('sort', data.sort)
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

const listAll = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetchAll
    let [result] = await dbConn.query(query, [
      data.role_id,
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

const getTotal = async id => {
  let response = {
    total: 0,
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.count)
    if (result.length)
      response.total = result[0].total
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listAllAdmin = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetchAllAdmin
    let [result] = await dbConn.query(query)
    response.records = result
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
  list: list,
  listAll: listAll,
  filter: filter,
  getTotal: getTotal,
  listAllAdmin: listAllAdmin,
}
