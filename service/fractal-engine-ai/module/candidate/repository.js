import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'


const listCouncilor = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let result = await dbConn.query(QUERY.fetchCouncilior)
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const fetchCandidate = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let result = await dbConn.query(QUERY.fetchCandidate, [
      data.tipo,
    ])
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const fetchBase = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let result = await dbConn.query(QUERY.fetchBase)
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}






export default {
  listCouncilor: listCouncilor,
  fetchCandidate: fetchCandidate,
  fetchBase: fetchBase,
}