import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'
import COMMAND from './command.js'


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
    let [result] = await transaction.query(COMMAND.create, {
      state_id: data.record.state_id,
      town_id: data.record.town_id,
      link_name: data.record.link_name,
      local_district: data.record.local_district,
      federal_district: data.record.federal_district,
      phone: data.record.phone,
      town_authority_list_json: data.record.town_authority_list_json,
      possible_candidate_list_json: data.record.possible_candidate_list_json,
      town_actor_list_json: data.record.town_actor_list_json,
      group_list_json: data.record.group_list_json,
      group_description: data.record.group_description,
      advice_list_json: data.record.advice_list_json,
      numerals_list_json: data.record.numerals_list_json,
    })
    await transaction.commit()
    response = await find({
      record: {
        id: result.insertId,
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
    await transaction.query(COMMAND.update,[
      data.record.town_id,
      data.record.link_name,
      data.record.local_district,
      data.record.federal_district,
      data.record.phone,
      data.record.town_authority_list_json,
      data.record.possible_candidate_list_json,
      data.record.town_actor_list_json,
      data.record.group_list_json,
      data.record.group_description,
      data.record.advice_list_json,
      data.record.numerals_list_json,
      data.record.id,
    ])
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
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let [result] =  await transaction.query(COMMAND.archive,[
      data.record.id,
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
    parseJSON(response.record, 'town_authority_list_json')
    parseJSON(response.record, 'possible_candidate_list_json')
    parseJSON(response.record, 'town_actor_list_json')
    parseJSON(response.record, 'group_list_json')
    parseJSON(response.record, 'advice_list_json')
    parseJSON(response.record, 'numerals_list_json')
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
    let query = QUERY.fetch.replace('sort', data.sort)
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
    let [result] = await dbConn.query(QUERY.count)
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

const findByTownId = async data => {
  let dbConn = null
  let response = {
    record: {},
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [result] = await dbConn.query(QUERY.getByTownId, [
      data.record.id,
    ])
    if (result.length)
      response.record = result[0]
    parseJSON(response.record, 'town_authority_list_json')
    parseJSON(response.record, 'possible_candidate_list_json')
    parseJSON(response.record, 'town_actor_list_json')
    parseJSON(response.record, 'group_list_json')
    parseJSON(response.record, 'advice_list_json')
    parseJSON(response.record, 'numerals_list_json')
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const parseJSON = (rec, propName) => {
  if (rec[propName] !== undefined && rec[propName] !== '')
    rec[propName] = JSON.parse(rec[propName])
  else
    rec[propName] = []
}


export default {
  add: add,
  update: update,
  remove: remove,
  find: find,
  list: list,
  getTotal: getTotal,
  filter: filter,
  findByTownId: findByTownId,
}