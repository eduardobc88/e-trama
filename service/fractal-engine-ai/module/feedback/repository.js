import MY_SQL_DB from '../../lib/mysqldb.js'
import COMMAND from './command.js'
import QUERY from './query.js'


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
    await transaction.beginTransaction()
    let [result] = await transaction.query(COMMAND.create, {
      feedback_title: data.feedback_title,
      feedback_description: data.feedback_description,
      category_id: data.category_id,
      user_id: data.user_id,
    })
    await transaction.commit()
    response.record = await get(result.insertId)
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
    await transaction.query(COMMAND.update, [
      data.feedback_title,
      data.feedback_description,
      data.category_id,
      data.id,
    ])
    await transaction.commit()
    response.record = await get(data.id)
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
    response.record = await get(data.id)
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let [result] =  await transaction.query(COMMAND.archive, [
      data.id,
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

const find = async id => {
  let dbConn = null
  let response = {
    record: {},
    error: null,
  }
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

const list = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
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

const getTotal = async id => {
  let dbConn = null
  let response = {
    total: 0,
    error: null,
  }
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

const filter = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.search
    let [result] = await dbConn.query(query, [
      `%${ data.search }%`,
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
