import MY_SQL_DB from '../../lib/mysqldb.js'
import COMMAND from './command.js'
import QUERY from './query.js'


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
      user_id: data.record.user_id,
      title: data.record.title,
      excerpt: data.record.excerpt,
      category_id: data.record.category_id,
      content: data.record.content,
      file_id: data.record.file_id,
      file_ids: data.record.file_ids,
      status: data.record.status,
    })
    await transaction.commit()
    response.record.id = result.insertId
    response = await get({
      record: {
        id: response.record.id,
      },
      prop_match: data.prop_match,
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
    let query = COMMAND.update.replaceAll('--match-prop', data.prop_match)
    await transaction.query(query,[
      data.record.user_id,
      data.record.title,
      data.record.excerpt,
      data.record.content,
      data.record.file_id,
      data.record.file_ids,
      data.record.category_id,
      data.record.status,
      data.record.id,
    ])
    await transaction.commit()
    response = await get({
     record: {
        id: data.record.id,
      },
      prop_match: data.prop_match,
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
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  let transaction = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    response = await get({
      record: {
        id: data.record.id,
      },
      prop_match: data.prop_match,
    })
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let query = COMMAND.archive.replaceAll('--match-prop', data.prop_match)
    let [result] = await transaction.query(query,[
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
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.get
    query = query.replaceAll('--match-prop', data.prop_match)
    let [result] = await dbConn.query(query, [
      data.record.id,
    ])
    if (result.length)
      response.record = result[0]
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
    query = query.replaceAll('--match-prop', data.prop_match)
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
  let response = {
    total: 0,
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.count
    query = query.replaceAll('--match-prop', data.prop_match)
    let [result] = await dbConn.query(query)
    if (result.length)
      response.total = result[0].total
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
    let query = QUERY.filter
    query = query.replaceAll('--match-prop', data.prop_match)
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


export default {
  add: add,
  update: update,
  remove: remove,
  find: find,
  list: list,
  getTotal: getTotal,
  filter: filter,
}
