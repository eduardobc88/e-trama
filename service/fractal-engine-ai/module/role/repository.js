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
      role_name: data.role_name,
      user_id: data.user_id,
    })
    response.record.id = result.insertId
    for (let i of data.role_resources)
      await transaction.query(COMMAND.createRoleResource, {
        role_id: response.record.id,
        resource_id: i.resource_id,
        permission: i.permission,
      })
    await transaction.commit()
    response = await find({
      id: response.record.id,
      user_id: data.user_id,
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
    let [result] = await transaction.query(COMMAND.update, [
      data.role_name,
      data.id,
      data.user_id,
    ])
    if (result.changedRows === 0)
      throw 'error updating record'
    for (let i of data.role_resources) {
      if (i.id !== undefined && i.id > 0) {
        if (i.removed)
          await transaction.query(COMMAND.archiveRoleResource, [
            i.id,
            i.role_id,
          ])
        else
          await transaction.query(COMMAND.updateRoleResource, [
            i.permission,
            i.id,
            i.role_id,
          ])
      } else
        await transaction.query(COMMAND.createRoleResource, {
          role_id: data.id,
          permission: i.permission,
          resource_id: i.resource_id,
        })
    }
    await transaction.commit()
    response = await find({
      id: data.id,
      user_id: data.user_id,
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
    response = await find({
      id: data.id,
      user_id: data.user_id,
    })
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let [result] =  await transaction.query(COMMAND.archive, [
      data.id,
      data.user_id,
    ])
    if (result.changedRows === 0)
      throw 'error deleting record'
    await transaction.query(COMMAND.archiveAllRoleResources, [
      data.id,
    ])
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
    let [result] = await dbConn.query(QUERY.get, [
      data.id,
      data.user_id,
    ])
    if (result.length)
      response.record = result[0]
    response.record.role_resources = []
    result = await dbConn.query(QUERY.getRoleResources, [
      data.id,
    ])
    response.record.role_resources = []
    if (result[0].length)
      response.record.role_resources = result[0]
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
    let [result] = await dbConn.query(query, [
      data.user_id,
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
      data.user_id,
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
    let [result] = await dbConn.query(QUERY.count, [
      data.user_id,
    ])
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
    let query = QUERY.search
    query = query.replaceAll('--match-replace', data.only_id)
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

const findRoleResources = async roleId => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let result = await dbConn.query(QUERY.getRoleResourceResources, [roleId])
    response.records = result[0]
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
  findRoleResources: findRoleResources,
}
