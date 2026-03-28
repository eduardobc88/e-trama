import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'
import COMMAND from './command.js'


const add = async data => {
  let dbConn = null
  let transaction = null
  let result = {
    record: {},
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    let [res, fields] = await transaction.query(COMMAND.create, {
        user_id: data.user_id,
        notification_title: data.notification_title,
        notification_description: data.notification_description,
        notification_type: data.notification_type,
        area_id: data.area_id,
      })
    await transaction.commit()
    let rec = await get({
      id: res.insertId,
      user_id: data.user_id,
    })
    result.record = rec
  } catch (err) {
    await transaction.rollback()
    result.error = err
  } finally {
    transaction.release()
    return result
  }
}

const find = async data => {
  let dbConn = null
  let result = {
    record: {},
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [res, fields] = await dbConn.query(QUERY.get, [
        data.id,
        data.user_id,
        data.area_id,
      ])
    if (res.length)
      res = res[0]
    result.record = res
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}

const list = async data => {
  let dbConn = null
  let result = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetch
    query = query.replace('sort', data.sort)
    let [records, fields] = await dbConn.query(query, [
      data.user_id,
      data.area_id,
      data.limit,
      data.skip,
    ])
    result.records = records
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}

const getTotal = async data => {
  let dbConn = null
  let result = {
    total: 0,
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [record, fields] = await dbConn.query(QUERY.count, [
        data.user_id,
        data.area_id,
      ])
    if (record.length)
      result.total = record[0].total
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}


export default {
  add: add,
  find: find,
  list: list,
  getTotal: getTotal,
}
