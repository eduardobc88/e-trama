import MY_SQL_DB from '../../lib/mysqldb.js'
import COMMAND from './command.js'
import QUERY from './query.js'


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
      resource_id: data.resource_id,
      permission: data.permission,
    })
    response = await find(result.insertId)
  } catch (err) {
    response.error = err
  } finally {
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

const listByRoleId = async roleId => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.fetch, [roleId])
    response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const hasPermission = async (roleId, resourceName, permissionType, customEntityName = '') => {
  let response = {
    total: 0,
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    if (customEntityName === '') {
      let [result] = await dbConn.query(QUERY.countResourcePermissionByName, [
          roleId,
          resourceName,
          `%${ permissionType }%`,
        ])
      if (result.length)
        response.total = result[0].total
    } else {
      // NOTE: CHECK FOR CUSTOM ENTITY PERMISSION
      let [result] = await dbConn.query(QUERY.countCustomEntityPermissionByName, [roleId, customEntityName, `%${ permissionType }%`])
      if (result.length)
        response.total = result[0].total
    }
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}


export default {
  add: add,
  find: find,
  listByRoleId: listByRoleId,
  hasPermission: hasPermission,
}