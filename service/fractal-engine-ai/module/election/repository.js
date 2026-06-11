import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'


const listElection = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetchElectionTypes
    let [result] = await dbConn.query(query)
    response.records = result
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listElectionResult = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let result = await dbConn.query(QUERY.fetchElectionResult, [
      data.scope,
      data.type,
      data.year,
    ])
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listElectionByFederalDistrict = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let result = await dbConn.query(QUERY.fetchElectionResultByFederalDistrict, [
      data.scope,
      data.type,
      data.year,
    ])
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listElectionByLocalDistrict = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let result = await dbConn.query(QUERY.fetchElectionResultByLocalDistrict, [
      data.scope,
      data.type,
      data.year,
    ])
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listElectionByTown = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let result = await dbConn.query(QUERY.fetchElectionResultByTown, [
      data.scope,
      data.type,
      data.year,
    ])
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listElectionBySection = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let result = await dbConn.query(QUERY.fetchElectionResultBySection, [
      data.scope,
      data.type,
      data.year,
    ])
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const listAll = async data => {
  let dbConn = null
  let response = {
    records: [],
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let result = await dbConn.query(QUERY.fetchByStateName, [
      `%${ data.state_name }%`,
    ])
    response.records = result[0]
    // NOTE: GET LOCAL DISTRICTS BY TOWN ID
    for (let i in response.records) {
      let r = response.records[i]
      result = []
      [result] = await dbConn.query(QUERY.getDistrictSectionByTownId, [
        r.town_id,
      ])
      response.records[i].local_district = []
      for (let ld of result[0])
        response.records[i].local_district.push(ld.local_district)
    }
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}



export default {
  listElection: listElection,
  listElectionResult: listElectionResult,
  listElectionByFederalDistrict: listElectionByFederalDistrict,
  listElectionByLocalDistrict: listElectionByLocalDistrict,
  listElectionByTown: listElectionByTown,
  listElectionBySection: listElectionBySection,
  listAll: listAll,
}