import SERVICE_CONFIG from '../../config.js'
import MY_SQL_DB from '../../lib/mysqldb.js'
import DIRECTORY from '../../lib/directory.js'
import QUERY from './query.js'
import COMMAND from './command.js'


const add = async data => {
  let dbConn = null
  let transaction = null
  let response = {
    record: {},
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    let [result] = await transaction.query(COMMAND.create, {
      name: data.record.name,
      description: data.record.description,
      gd_folder_id: '',
    })
    DIRECTORY.create(`${ SERVICE_CONFIG.uploadDirectory }${ result.insertId }`)
    await transaction.commit()
    response = await find({
      record: {
        id: result.insertId,
      },
    })
  } catch (err) {
    await transaction.rollback()
    response.error = err
  } finally {
    transaction.release()
    return response
  }
}

const update = async data => {
  let dbConn = null
  let transaction = null
  let response = {
    record: {},
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    await transaction.query(COMMAND.update,[
      data.record.name,
      data.record.description,
      data.record.id,
    ])
    await transaction.commit()
    response = await find({
      record: {
        id: data.record.id,
      },
    })
  } catch (err) {
    await transaction.rollback()
    response.error = err
  } finally {
    transaction.release()
    return response
  }
}

const remove = async data => {
  let dbConn = null
  let transaction = null
  let response = {  
    record: {},
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    response = await find({
      record: {
        id: data.record.id,
      },
    })
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let [result] =  await transaction.query(COMMAND.archive,[
      data.record.id,
    ])
    if (result.changedRows === 0)
      throw 'error deleting record'
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    response.error = err
  } finally {
    transaction.release()
    return response
  }
}

const find = async data => {
  let dbConn = null
  let response = {
    record: {},
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.get, [
      data.record.id,
    ])
    if (result.length)
      response.record = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const list = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetch
    query = query.replace('--sort', data.sort)
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

const getTotal = async data => {
  let dbConn = null
  let response = {
    total: 0,
    error: null,
  }
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

const filter = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.search, [
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


export default {
  add: add,
  update: update,
  remove: remove,
  find: find,
  list: list,
  getTotal: getTotal,
  filter: filter,
}
