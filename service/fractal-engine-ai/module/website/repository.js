import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'
import COMMAND from './command.js'


const findRole = async data => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.getRole, [
      data.id,
    ])
    if (result.length)
      response.record = result[0]
    result = []
    [result] = await dbConn.query(QUERY.fetchRoleResource, [
      data.id,
    ])
    response.record.role_resources = []
    if (result.length)
      response.record.role_resources = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const findArea = async data => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.getArea, [
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

const findUserByQRCode = async qrCode => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.getUserByQRCode, [
      qrCode,
    ])
    if (result.length)
      response.record = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const findUserByUserName = async userName => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.getUserByUserName, [
      userName,
    ])
    if (result.length)
      response.record = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listRole = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.fetchRole, [
      data.user_id,
    ])
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listLanguage = async () => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.fetchLanguage)
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const addRegistry = async (data) => {
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
    let [result] = await transaction.query(COMMAND.createRegistry, {
      name: data.record.name,
      paternal_surname: data.record.paternal_surname,
      maternal_surname: data.record.maternal_surname,
      phone: data.record.phone,
      section: data.record.section,
      address: data.record.address,
      latitude: data.record.latitude,
      longitude: data.record.longitude,
      state_id: data.record.state_id,
      town_id: data.record.town_id,
      file_id: data.record.file_id,
    })
    await transaction.commit()
    response = await findRegistry({
      record: { id: result.insertId, },
    })
  } catch (err) {
    await transaction.rollback()
    response.error = err
  } finally {
    transaction.release()
    return response
  }
}

const findRegistry = async data => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.getRegistry, [
      data.record.id,
    ])
    response.record = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}


export default {
  findRole: findRole,
  findArea: findArea,
  findUserByQRCode: findUserByQRCode,
  findUserByUserName: findUserByUserName,
  listRole: listRole,
  listLanguage: listLanguage,
  addRegistry: addRegistry,
  findRegistry: findRegistry,
}
