import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'
import COMMAND from './command.js'


const remove = async (userId, sessionId) => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    let query = COMMAND.remove.replaceAll('--user-id', userId)
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(query, [
      sessionId,
    ])
    for (let rec of result) {
      let dataJSON = JSON.parse(rec.data)
      delete dataJSON.user
      let id = dataJSON.sessionId
      dataJSON = JSON.stringify(dataJSON)
      await dbConn.query(COMMAND.updateSessionData, [
        dataJSON,
        id,
      ])
    }
    response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const findSessionsByUserId = async userId => {
  let response = {
    records: {},
    error: null,
  }
  let dbConn = null
  try {
    let query = QUERY.find.replaceAll('--user-id', userId)
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(query, [])
    response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const updateUserStatus = async (sessionId, userStatus) => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    let userId = 0
    let customerId = 0
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.findBySessionId, [sessionId])
    if (result.length) {
      response.record = result[0]
      let dataJSON = JSON.parse(response.record.data)
      if (dataJSON.user.user_status !== 'busy')
        dataJSON.user.user_status = userStatus
      userId = dataJSON.user.id
      customerId = dataJSON.user.user_id
      dataJSON = JSON.stringify(dataJSON)
      await dbConn.query(COMMAND.updateSessionData, [
        dataJSON,
        sessionId,
      ])
      await dbConn.query(COMMAND.updateUserStatus, [
        userStatus,
        userId,
      ])
    }
    response.record = {
      id: parseInt(userId),
      user_id: parseInt(customerId),
      user_status: userStatus,
    }
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const removeAllSessions = async (userId, sessionId) => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    let query = COMMAND.remove.replaceAll('--user-id', userId)
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(query, [
      sessionId,
    ])
    for (let rec of result) {
      if (rec.session_id === sessionId)
        continue
      let dataJSON = JSON.parse(rec.data)
      delete dataJSON.user
      let id = dataJSON.sessionId
      dataJSON = JSON.stringify(dataJSON)
      await dbConn.query(COMMAND.updateSessionData, [
        dataJSON,
        id,
      ])
      await dbConn.query(COMMAND.removeBySessionId, [
        rec.session_id,
      ])
    }
    response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}


export default {
  remove: remove,
  findSessionsByUserId: findSessionsByUserId,
  updateUserStatus: updateUserStatus,
  removeAllSessions: removeAllSessions,
}
