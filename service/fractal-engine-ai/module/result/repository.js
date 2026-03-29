import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'


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
    console.log(result[0].length)
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
  listAll: listAll,
}