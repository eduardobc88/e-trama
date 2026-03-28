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
      language_name: data.language_name,
    })
    response.record.id = result.insertId
    for (let i of data.language_messages)
      await transaction.query(COMMAND.createMessage, {
        language_id: response.record.id,
        language_message_key: i.language_message_key,
        language_message_value: i.language_message_value,
      })
    await transaction.commit()
    response = await find(response.record.id)
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
    let [result] =  await transaction.query(COMMAND.update, [
      data.language_name,
      data.id,
    ])
    if (result.changedRows === 0)
      throw 'error updating record'
    for (let i of data.language_messages) {
      if (i.id) {
        if (i.removed) {
          await transaction.query(COMMAND.archiveMessage, [
            i.id,
            data.id,
          ])
        } else {
          await transaction.query(COMMAND.updateMessage, [
            i.language_message_key,
            i.language_message_value,
            i.id,
            data.id,
          ])
        }
      } else {
        await transaction.query(COMMAND.createMessage, {
          language_id: data.id,
          language_message_key: i.language_message_key,
          language_message_value: i.language_message_value,
        })
      }
    }
    await transaction.commit()
    response = await find(data.id)
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
    response = await find(data.id)
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let [result] = await transaction.query(COMMAND.archive, [
      data.id,
    ])
    if (result.changedRows === 0)
      throw 'error deleting record'
    await transaction.query(COMMAND.archiveMessage, [
      data.id,
    ])
    await transaction.commit()
  } catch (err) {
    console.error(err)
    await transaction.rollback()
    response.error = err
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
    result = []
    [result] = await dbConn.query(QUERY.fetchMessages, [id])
    response.record.language_messages = result[0]
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

const listAll = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetchAll
    let result = await dbConn.query(query, [
      data.limit,
      data.skip,
    ])
    response.records = result[0]
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
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
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
  listAll: listAll,
  getTotal: getTotal,
  filter: filter,
}
