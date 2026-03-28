import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'
import COMMAND from './command.js'


const add = async data => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(COMMAND.insert, {
      file_name: data.file_name,
      file_title: data.file_title,
      file_description: data.file_description,
      file_size: data.file_size,
      file_mime_type: data.file_mime_type,
      user_id: data.user_id,
      area_id: data.area_id,
      gd_file_id: data.gd_file_id,
    })
    let id = result.insertId
    response = await find({
      id: id,
      area_id: data.area_id,
    })
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
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    await dbConn.query(COMMAND.update, [
      data.file_title,
      data.file_description,
      data.id,
      data.area_id,
    ])
    response.record = await find({
      id: data.id,
      area_id: data.area_id,
    })
  } catch (err) {
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
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    response = await find({
      id: data.id,
      area_id: data.area_id,
    })
    if (response.record.error !== null)
      throw 'not found'
    let [result] = await dbConn.query(COMMAND.remove, [
      data.id,
      data.area_id,
    ])
    if (result.changedRows === 0)
      throw 'file not removed'
  } catch (err) {
    response.error = err
  } finally {
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
    let [result] = await dbConn.query(QUERY.select, [
      data.id,
      data.area_id,
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
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.selectPaged
    query = query.replace('sort', data.sort)
    let [result] = await dbConn.query(query, [
      data.area_id,
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
    let [result] = await dbConn.query(QUERY.filter, [
      data.area_id,
      `%${ data.filter }%`,
      data.limit,
    ])
    response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const getTotal = async data => {
  let response = {
    total: 0,
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.selectTotal, [
      data.area_id,
    ])
    if (result.length)
      response.total = result[0].total
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const findById = async data => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.selectById, [
      data.id,
    ])
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
  update: update,
  remove: remove,
  find: find,
  list: list,
  filter: filter,
  getTotal: getTotal,
  findById: findById,
}
