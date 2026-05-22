import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'


const listFederalDistrict = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetchFederalDistrict
    let [result] = await dbConn.query(query, [])
    response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listLocalDistrict = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetchLocalDistrict
    let [result] = await dbConn.query(query, [])
    response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listTown = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetchTown
    let [result] = await dbConn.query(query, [])
    response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listSection = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetchSection
    let [result] = await dbConn.query(query, [])
    response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

export default {
  listFederalDistrict: listFederalDistrict,
  listLocalDistrict: listLocalDistrict,
  listTown: listTown,
  listSection: listSection,
}
