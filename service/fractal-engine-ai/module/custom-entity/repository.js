import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'
import COMMAND from './command.js'
import PROCESS from './process.js'
import CUSTOM_FIELD_QUERY from '../custom-field/query.js'


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
      name: data.record.name,
      resource_name: data.record.resource_name,
      description: data.record.description,
      prefix: data.record.prefix,
      suffix: data.record.suffix,
      number: data.record.number,
    })
    response.record.id = result.insertId
    // NOTE: PROCESS TO CREATE CUSTOM ENTITY TABLES
    let resProcess = await PROCESS.addCustomEntity(transaction, data.record.name)
    if (resProcess.error !== null)
      throw resProcess.error
    // NOTE: PROCESS TO CREATE CUSTOM ENTITY FIELDS
    for (let cef of data.record.custom_entity_fields) {
      cef.custom_entity_id = response.record.id
      // NOTE: SELECT CUSTOM FIELD
      let [result] =  await transaction.query(CUSTOM_FIELD_QUERY.selectOne,[
        cef.custom_field_id
      ])
      if (!result.length)
        throw 'custom field not exists'
      let customField = result[0]
      if (!cef.id && cef.active) {
        // NOTE: PROCESS TO CREATE CUSTOM ENTITY FIELD
        let [result] =  await transaction.query(COMMAND.addCustomEntityField,{
          custom_entity_id: cef.custom_entity_id,
          custom_field_id: cef.custom_field_id,
          is_unique: cef.is_unique,
          is_search: cef.is_search,
          active: cef.active,
        })
        if (!result.insertId)
          throw 'error creating custom entity field'
        // NOTE: PROCESS TO ADD COLUMN
        resProcess = await PROCESS.addCustomEntityColumn(transaction, data.record.name, customField.name, customField.type, cef.is_unique)
        if (resProcess.error !== null)
          throw resProcess.error
      }
    }
    // NOTE: PROCESS TO CREATE RESOURCES
    resProcess = await PROCESS.addResource(transaction, data.record.resource_name, data.record.description)
    if (resProcess.error !== null)
      throw resProcess.error
    let resourceId = resProcess.id
    // NOTE: PROCESS TO CREATE ROLE RESOURCE WITH PERMISSION
    for (let role of data.record.custom_entity_role_permissions) {
      if (role.permission === '')
        continue
      resProcess = await PROCESS.addRoleResource(transaction, {
        role_id: role.role_id,
        resource_id: resourceId,
        permission: role.permission,
      })
      if (resProcess.error !== null)
        throw resProcess.error
    }
    response = await find({
      record: {
        id: response.record.id,
      },
    })
    await transaction.commit()
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
    // NOTE GET CURRENT RECORD
    response = await find({
      record: {
        id: data.record.id,
      },
    })
    // NOTE: UPDATE RECORD
    await transaction.query(COMMAND.update,[
      data.record.name,
      data.record.resource_name,
      data.record.description,
      data.record.prefix,
      data.record.suffix,
      data.record.number,
      data.record.id,
    ])
    // NOTE: PROCESS TO CREATE CUSTOM ENTITY TABLES
    let resProcess = await PROCESS.updateCustomEntity(transaction, response.record.name, data.record.name)
    if (resProcess.error !== null)
      throw resProcess.error
    // NOTE: UPDATE CUSTOM ENTITY FIELDS
    for (let index in data.record.custom_entity_fields) {
      let cef = data.record.custom_entity_fields[index]
      // NOTE: SELECT CUSTOM FIELD
      let [result] = await transaction.query(CUSTOM_FIELD_QUERY.get,[
        cef.custom_field_id
      ])
      if (!result.length)
        throw 'custom field not exists'
      let customField = result[0]
      if (!cef.id && cef.active) {
        // NOTE: CREATE CUSTOM FIELD
        let [result] =  await transaction.query(COMMAND.addCustomEntityField,{
          custom_entity_id: cef.custom_entity_id,
          custom_field_id: cef.custom_field_id,
          is_unique: cef.is_unique,
          is_search: cef.is_search,
          active: cef.active,
        })
        if (!result.insertId)
          throw 'error creating custom entity field'
        // NOTE: ADD COLUMN PROCRESS
        resProcess = await PROCESS.addCustomEntityColumn(transaction, data.record.name, customField.name, customField.type, cef.is_unique)
        if (resProcess.error !== null)
          throw resProcess.error
      } else {
        if (cef.id && !cef.active) {
          // NOTE: REMOVE CUSTOM ENTITY FIELD
          let [result] =  await transaction.query(COMMAND.archiveCustomEntityField,[
            cef.id,
            ])
          if (result.changedRows === 0)
            throw 'error deleting custom entity field'
          // NOTE: DROP COLUMN PROGRESS
          resProcess = await PROCESS.removeCustomEntityColumn(transaction, data.record.name, customField.name)
          if (resProcess.error !== null)
            throw resProcess.error
        } else {
          // NOTE: UPDATE CUSTOM ENTITY FIELD
          let [result] =  await transaction.query(COMMAND.updateCustomEntityField,[
            cef.is_unique,
            cef.is_search,
            cef.active,
            cef.id,
            ])
          if (result.serverStatus !== 2)
            throw 'error updating custom entity'
          if (cef.is_unique === undefined || (cef.is_unique === response.record.custom_entity_fields[index].is_unique))
            continue
          // NOTE: DROP COLUMN UNIQUE
          resProcess = await PROCESS.addOrRemoveCustomEntityColumnUnique(transaction, data.record.name, customField.name, cef.is_unique)
          if (resProcess.error !== null)
            throw resProcess.error
        }
      }
    }
    // NOTE: PROCESS TO CREATE OR REMOVE ROLE RESOURCE WITH PERMISSION
    for (let role of data.record.custom_entity_role_permissions) {
      if (role.id > 0) {
        if (role.permission === '') {
          // NOTE: PROCESS TO REMOVE ROLE RESOURCE
          resProcess = await PROCESS.removeRoleResource(transaction, role.id)
          continue
        }
        // NOTE: PROCESS TO UPDATE ROLE RESOURCE
        resProcess = await PROCESS.updateRoleResource(transaction, role.id, role.permission)
      } else if (role.id === 0 && role.permission !== '') {
        // NOTE: CREATE NEW ROLE RESOURCE
        resProcess = await PROCESS.addRoleResource(transaction, {
          role_id: role.role_id,
          resource_id: role.resource_id,
          permission: role.permission,
        })
        if (resProcess.error !== null)
          throw resProcess.error
      }
    }
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
    if (response.error !== null)
      throw response.error
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let [result] =  await transaction.query(COMMAND.archive,[
      data.record.id,
    ])
    if (result.changedRows === 0)
      throw 'error deleting record'
    // NOTE: RUN PROCESS TO CREATE CUSTOM ENTITY TABLES
    let resProcess = await PROCESS.removeCustomEntity(transaction, response.record.name)
    if (resProcess.error !== null)
      throw resProcess.error
    // NOTE: DELETE RESOURCE
    result = []
    [result] =  await transaction.query(COMMAND.archiveResource,[
      response.record.resource_id,
    ])
    if (result.changedRows === 0)
      throw 'error deleting record'
    // NOTE: DELETE ROLE RESOURCE
    result = []
    [result] =  await transaction.query(COMMAND.archiveRoleResource,[
      response.record.resource_id,
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
    // NOTE: GET CUSTOM ENTITY FIELDS
    let [resCustomEntityFields, _resCustomEntityFields] = await dbConn.query(QUERY.fetchCustomEntityFields, [
      response.record.id,
    ])
    response.record.custom_entity_fields = resCustomEntityFields
    let [resCustomEntityRolePermissions, _resCustomEntityRolePermissions] = await dbConn.query(QUERY.fetchCustomEntityRolePermissions, [
      response.record.resource_name,
    ])
    response.record.custom_entity_role_permissions = resCustomEntityRolePermissions
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

const filterEntityFields = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.searchCustomEntityFields, [
      data.custom_entity_id,
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

const findByName = async data => {
  let dbConn = null
  let response = {
    record: {},
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.getByName, [
      data.record.name,
    ])
    if (result.length)
      response.record = result[0]
    // NOTE: GET CUSTOM ENTITY FIELDS
    result = []
    [result] = await dbConn.query(QUERY.fetchCustomEntityFields, [
      response.record.id,
    ])
    response.record.custom_entity_fields = result[0]
    for (let cef of response.record.custom_entity_fields) {
      if (cef.type !== 'entity')
        continue

      result = []
      [result] = await dbConn.query(QUERY.get, [
        cef.custom_entity_id,
      ])
      cef['custom_entity_name'] = result[0].resource_name
    }
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
  filterEntityFields: filterEntityFields,
  findByName: findByName,
}
