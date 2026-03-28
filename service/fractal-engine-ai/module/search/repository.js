import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'


const filter = async (userId, customerUserId, resources, word, areaId, areaName) => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    let searchWord = `%${ word }%`
    dbConn = await MY_SQL_DB.getPoolConnection()
    let results = []
    let result = null
    for (let resource of resources) {
      if (resource.model === 'file') {
        result = await dbConn.query(QUERY.searchFile, [
          userId,
          searchWord,
          5,
        ])
        results = [...results, ...result[0]]
      }
      if (resource.model === 'user') {
        result = await dbConn.query(QUERY.searchUser, [
          userId,
          searchWord,
          5,
        ])
        results = [...results, ...result[0]]
      }
      if (resource.model === 'resource') {
        result = await dbConn.query(QUERY.searchResource, [
          searchWord,
          5,
        ])
        results = [...results, ...result[0]]
      }
      if (resource.model === 'role') {
        result = await dbConn.query(QUERY.searchRole, [
          userId,
          searchWord,
          5,
        ])
        results = [...results, ...result[0]]
      }
      if (resource.model === 'language') {
        result = await dbConn.query(QUERY.searchLanguage, [
          searchWord,
          5,
        ])
        results = [...results, ...result[0]]
      }
      if (resource.model === 'custom-entity-record') {
        // NOTE: GET AREA
        let customEntityName = areaName.replaceAll(' ', '-').toLowerCase()
        let tableName = `ce-${ customEntityName }-record`
        tableName = `\`${ tableName }\``
        let query = QUERY.searchCustomEntityRecord.replaceAll('--custom-entity-name', customEntityName)
        query = query.replaceAll('--table-name', tableName)
        result = await dbConn.query(query, [
          searchWord,
          searchWord,
          searchWord,
          searchWord,
        ])
        results = [...results, ...result[0]]
      }
    }
    response.records = results
  } catch (err) {
    console.error(err)
    response.error = err
  } finally {
    return response
  }
}

const fetchRoleResourceDataById = async roleId => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let result = await dbConn.query(QUERY.fetchRoleResources,[
      roleId
    ])
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}


export default {
  filter: filter,
  fetchRoleResourceDataById: fetchRoleResourceDataById,
}
