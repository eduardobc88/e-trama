import MY_SQL_DB from '../../lib/mysqldb.js'
import QUERY from './query.js'
import COMMAND from './command.js'
import AREA_QUERY from '../area/query.js'


// NOTE: NOT IMPLEMENTED YET
const filter = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let customEntityName = data.custom_entity_name.replaceAll('_', '-')
    let [result] = await dbConn.query(QUERY.getCustomEntityByName, [
      customEntityName,
    ])
    if (!result.length)
      throw 'not found'
    let customEntity = {}
    if (result.length)
      customEntity = result[0]
    // NOTE: GET CUSTOM ENTITY FIELD DEFAULT SEARCH FIELD
    result = await dbConn.query(QUERY.getCustomEntityFieldSearch, [
      customEntity.id,
    ])
    if (!result.length)
      throw 'not found'
    let customEntityFieldName = result[0].name.toString().replaceAll(' ', '_')
    let query = QUERY.searchMany.replaceAll('--custom-entity-name', data.custom_entity_name)
    query = query.replaceAll('--column-name', customEntityFieldName)
    result = await dbConn.query(query, [
      `%${ data.search }%`,
      data.limit,
    ])
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const remove = async data => {
  let response = {
    record: [],
    error: null,
  }
  let dbConn = null
  let transaction = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let query = COMMAND.archive.replaceAll('--custom-entity-name', data.custom_entity_name)
    let result = await transaction.query(query, [
      data.record.id,
    ])
    result = result[0]
    if (result.affectedRows === 0)
      throw 'no changes were detected'
    response = await find({
      custom_entity_name: data.custom_entity_name,
      record: {
        id: data.record.id,
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
  let response = {
    record: [],
    error: null,
  }
  let dbConn = null
  let transaction = null
  try {
    data.record.attachment_files = JSON.stringify(data.record.attachment_files)
    data.record.related_records = JSON.stringify(data.record.related_records)
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let query = COMMAND.update.replaceAll('--custom-entity-name', data.custom_entity_name)
    let recordData = Object.assign(data.record, { user_id: data.user_id })
    let resultSetQuery = await setCustomEntityUpdateFieldNames(transaction, data.custom_entity_name, query, recordData)
    let result = await transaction.query(resultSetQuery.query, resultSetQuery.values)
    if (result.affectedRows === 0)
      throw 'no changes were detected'
    await transaction.commit()
    response = await find({
      custom_entity_name: data.custom_entity_name,
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

const add = async data => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  let transaction = null
  try {
    data.record.attachment_files = JSON.stringify(data.record.attachment_files)
    data.record.related_records = JSON.stringify(data.record.related_records)
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let query = COMMAND.create.replaceAll('--custom-entity-name', data.custom_entity_name)
    let recordData = Object.assign(data.record, { user_id: data.user_id })
    recordData = await setCustomEntityFieldInsertNameValues(transaction, data.custom_entity_name, recordData)
    let result = await transaction.query(query, recordData)
    result = result[0]
    response.record.id = result.insertId
    await transaction.commit()
    response = await find({
      custom_entity_name: data.custom_entity_name,
      record: {
        id: response.record.id,
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

const list = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.fetch
    query = await setCustomEntitySelectFieldNames(dbConn, data.custom_entity_name, query)
    query = query.replace('--sort', data.sort)
    let result = await dbConn.query(query, [
      data.limit,
      data.skip,
    ])
    response.records = result[0]
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const find = async data => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.get
    let customEntityName = data.custom_entity_name.replaceAll('_', '-')
    // NOTE: GET CUSTOM ENTITY
    let result = await dbConn.query(QUERY.getCustomEntityByName, [
      customEntityName,
    ])
    let customEntity = {}
    if (result.length)
      customEntity = result[0]
    // NOTE: GET CUSTOM ENTITY FIELDS
    result = await dbConn.query(QUERY.fetchCustomEntityFields, [
      customEntity.id,
    ])
    let customEntityFields = result[0]
    // NOTE: GET RECORD
    query = await setCustomEntitySelectFieldNames(dbConn, data.custom_entity_name, query)
    result = await dbConn.query(query, [
      data.record.id,
    ])
    result = result[0]
    if (result.length)
      response.record = result[0]
    // NOTE: FOR EACH FIELD ENTITY TYPE GET VALUE ACCORDING AT THE ENTITY RECORD ID
    let recordKeys = Object.keys(response.record)
    for (let cef of customEntityFields) {
      if (cef.type !== 'entity')
        continue
      let cefName = cef.name.replaceAll(' ', '_')
      for (let rKey of recordKeys) {
        if (rKey === cefName) {
          response.record[`${ rKey }_id_ref`] = ''
          // NOTE: GET CUSTOM ENTITY BY ID
          result = await dbConn.query(QUERY.getCustomEntityById, [
            cef.custom_entity_id,
          ])
          result = result[0]
          let customEntityF = {}
          if (result.length)
            customEntityF = result[0]
          // NOTE: GET CUSTOM ENTITY RECORD FIELD SEARCH
          result = await dbConn.query(QUERY.getCustomEntityFieldSearch, [
            cef.custom_entity_id,
          ])
          result = result[0]
          let customEntityRecordSearchField = {}
          if (!result.length)
            continue
          if (result.length)
            customEntityRecordSearchField = result[0]
          let customEntityRecordName = customEntityF.resource_name.replaceAll('_', '-')
          let customEntityRecordFieldName = customEntityRecordSearchField.name.replaceAll(' ', '_')
          let cefName = cef.name.replaceAll(' ', '_')
          let customEntityRecordId = response.record[cefName]
          // NOTE: GET CUSTOM ENTITY RECORD
          let customEntityRecordQuery = QUERY.getCustomEntityRecordById.replaceAll('--custom-entity-name', customEntityRecordName)
          customEntityRecordQuery = customEntityRecordQuery.replaceAll('--custom-entity-field', customEntityRecordFieldName)
          result = await dbConn.query(customEntityRecordQuery, [
            customEntityRecordId,
          ])
          result = result[0]
          if (result.length)
            response.record[`${ rKey }_id_ref`] = result[0][customEntityRecordFieldName]
          break
        }
      }
    }
    // NOTE: PARSE ATTACHMENT FILES
    if (response.record.attachment_files !== '' && response.record.attachment_files !== null && response.record.attachment_files !== 'NULL' && response.record.attachment_files !== undefined)
      response.record.attachment_files = JSON.parse(response.record.attachment_files)
    else
      response.record.attachment_files = []
    // NOTE: PARSE RELATED RECORDS
    if (response.record.related_records !== '' && response.record.related_records !== null && response.record.related_records !== 'NULL' && response.record.related_records !== undefined)
      response.record.related_records = JSON.parse(response.record.related_records)
    else
      response.record.related_records = []
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const getTotal = async data => {
  let response = {
    total: 0,
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let customEntityName = data.custom_entity_name.replaceAll('_', '-')
    let query = QUERY.count.replace('--custom-entity-name', customEntityName)
    let result = await dbConn.query(query)
    if (result.length)
      response.total = result[0].total
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const filterRelatedRecord = async data => {
  let response = {
    records: [],
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    // NOTE: GET ALL CUSTOM ENTITIES
    let result = await dbConn.query(QUERY.fetchCustomEntity)
    // NOTE: SEARCH FOR EACH CUSTOM ENTITY RECORD TABLE
    let customEntityRecords = result[0]
    let resultRecords = []
    for (let ce of customEntityRecords) {
      let resourceName = ce.resource_name.replaceAll('_', '-')

      // NOTE: GET CUSTOM ENTITY FIELD DEFAULT SEARCH FIELD
      result = await dbConn.query(QUERY.getCustomEntityFieldSearch, [
        customEntity.id,
      ])
      if (!result.length)
        throw 'custom entity field search not found'
      let customEntityFieldName = result[0].name

      let searchQuery = QUERY.search.replaceAll('--custom-entity-name', resourceName)
      searchQuery = searchQuery.replaceAll('--search-field', customEntityFieldName)
      result = await dbConn.query(searchQuery, [
        `%${ data.search }%`,
        data.limit,
      ])
      if (result.length)
        resultRecords = resultRecords.concat(result[0])
    }
    response.records = resultRecords
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

// TODO: IMPROVE THIS
const findRelatedRecord = async data => {
  let response = {
    record: {},
    error: null,
  }
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.get
    let customEntityName = data.custom_entity_name.replaceAll('_', '-')
    // NOTE: GET CUSTOM ENTITY
    let result = await dbConn.query(QUERY.getCustomEntityByName, [
      customEntityName,
      ])
    let customEntity = {}
    if (result.length)
      customEntity = result[0]
    // NOTE: GET CUSTOM ENTITY FIELDS
    //let [customEntityFields, _customEntityFields] = await dbConn.query(QUERY.fetchCustomEntityFields, [
    //  customEntity.id,
    //  ])
    // NOTE: GET RECORD
    query = await setCustomEntitySelectFieldNames(dbConn, data.custom_entity_name, query)
    result = await dbConn.query(query, [
      data.record.id,
    ])
    if (result.length)
      response.record = result[0]
    // NOTE: PARSE RELATED RECORDS
    if (response.record.related_records !== '' && response.record.related_records !== null && response.record.related_records !== 'NULL')
      response.record.related_records = JSON.parse(response.record.related_records)
    else
      response.record.related_records = []
    // NOTE: CHECK IF RELATED RECORD ID IS ON RECORD RELATED RECORDS
    let relatedRecordData = null
    for (let rr of response.record.related_records)
      if (rr.id === parseInt(data.related_record_id) && rr.origin_area_id === parseInt(data.origin_area_id) && rr.destination_area_id === parseInt(data.destination_area_id)) {
        relatedRecordData = rr
        break
      }
    if (relatedRecordData === null)
      throw 'no record'
    // NOTE: GET ORIGIN AREA
    let queryArea = AREA_QUERY.find
    result = await dbConn.query(queryArea, [
      relatedRecordData.origin_area_id,
    ])
    let areaRecord = {}
    if (result.length)
      areaRecord = result[0]
    customEntityName = areaRecord.name.toLowerCase().replaceAll(' ', '-')
    // NOTE: GET RECORD
    query = QUERY.get
    query = await setCustomEntitySelectFieldNames(dbConn, customEntityName, query)
    result = await dbConn.query(query, [
      relatedRecordData.origin_area_id,
      relatedRecordData.origin_area_id,
      data.related_record_id,
    ])
    let relatedRecord = {}
    if (result.length)
      relatedRecord = result[0]
    if (relatedRecord === null) {
      // NOTE: REQUEST DESTINATION AREA RECORD
      queryArea = AREA_QUERY.find
      result = await dbConn.query(queryArea, [
        relatedRecordData.destination_area_id,
        ])
      let areaRecord = {}
      if (result.length)
        areaRecord = result[0]
      customEntityName = areaRecord.name.toLowerCase().replaceAll(' ', '-')
      // NOTE: GET RECORD
      query = QUERY.get
      query = await setCustomEntitySelectFieldNames(dbConn, customEntityName, query)
      result = await dbConn.query(query, [
        relatedRecordData.destination_area_id,
        relatedRecordData.destination_area_id,
        data.related_record_id,
      ])
      if (result.length)
        response.record = result[0]
    }
    if (response.record.folio !== relatedRecordData.folio)
      response.record = {}
  } catch (err) {
    response.record = {}
    response.error = err
  } finally {
    return response
  }
}


const setCustomEntityUpdateFieldNames = async (dbConn, customEntityName, query, values) => {
  let result = {
    query: query,
    values: [],
  }
  let defaultFields = {
    updated_user_id: values.updated_user_id,
    attachment_files: values.attachment_files,
    related_records: values.related_records,
  }
  try {
    result.query = result.query.replace('--custom-entity-name', customEntityName)
    customEntityName = customEntityName.replaceAll('_', '-')
    // NOTE: GET CUSTOM ENTITY
    let [customEntity, _customEntity] = await dbConn.query(QUERY.getCustomEntityByName, [
      customEntityName,
      ])
    if (customEntity.length)
      customEntity = customEntity[0]
    // NOTE: GET CUSTOM ENTITY FIELDS BY NAME
    let [customEntityFields, _customEntityFields] = await dbConn.query(QUERY.fetchCustomEntityFields, [
      customEntity.id,
      ])
    // NOTE: SET DEFAULT FIELD VALUES
    let customFields = {}
    for (let key of Object.keys(defaultFields)) {
      let val = defaultFields[key]
      customFields[`${ key } = ?`] = val
    }
    // NOTE: SET ENTITY FIELD VALUES AND NAMES
    for (let cef of customEntityFields) {
      let fieldName = cef.name.replaceAll(' ', '_')
      customFields[`${ fieldName } = ?`] = values[fieldName]
    }
    // NOTE: FORMAT
    result.query = result.query.replace('--custom-entity-fields', Object.keys(customFields).toString())
    customFields['id'] = values.id
    result.values = Object.values(customFields)
  } catch (err) {
    result.query = ''
    result.values = []
  } finally {
    return result
  }
}

const setCustomEntityFieldInsertNameValues = async (dbConn, customEntityName, recordData) => {
  let record = {
    created_user_id: recordData.created_user_id,
    updated_user_id: recordData.updated_user_id,
    attachment_files: recordData.attachment_files,
    related_records: recordData.related_records,
  }
  try {
    customEntityName = customEntityName.replaceAll('_', '-')
    // NOTE: GET CUSTOM ENTITY
    let [customEntity, _customEntity] = await dbConn.query(QUERY.getCustomEntityByName, [
      customEntityName,
      ])
    if (customEntity.length)
      customEntity = customEntity[0]
    // NOTE: GET CUSTOM ENTITY FIELDS BY NAME
    let [customEntityFields, _customEntityFields] = await dbConn.query(QUERY.fetchCustomEntityFields, [
      customEntity.id,
      ])
    for (let cef of customEntityFields) {
      let name = cef.name.replaceAll(' ', '_')
      for (let key in recordData)
        if (name === key) {
          record[name] = recordData[key]
          break
        }
    }
  } catch (err) {
    record = {}
  } finally {
    return record
  }
}

const setCustomEntitySelectFieldNames = async (dbConn, customEntityName, query) => {
  let queryResult = query
  try {
    queryResult = queryResult.replace('--custom-entity-name', customEntityName)
    customEntityName = customEntityName.replaceAll('_', '-')
    // NOTE: GET CUSTOM ENTITY
    let [customEntity, _customEntity] = await dbConn.query(QUERY.getCustomEntityByName, [
      customEntityName,
      ])
    if (customEntity.length)
      customEntity = customEntity[0]
    // NOTE: GET CUSTOM ENTITY FIELDS BY NAME
    let [customEntityFields, _customEntityFields] = await dbConn.query(QUERY.fetchCustomEntityFields, [
      customEntity.id,
      ])
    let customFields = []
    for (let cef of customEntityFields) {
      let name = cef.name.replaceAll(' ', '_')
      if (cef.type === 'date')
        name = `DATE_FORMAT(${ name }, '%Y-%m-%d %H:%i:%s') AS ${ name }`
      customFields.push(name)
    }
    customFields = customFields.toString()
    if (customFields !== '')
      customFields = `, ${ customFields.toString() }`
    queryResult = queryResult.replace('--custom-entity-fields', customFields)
  } catch (err) {
    queryResult = ''
  } finally {
    return queryResult
  }
}

const findAttachment = async data => {
  let dbConn = null
  let result = {
    record: {},
    error: null,
  }
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = QUERY.getAttachment
    let customEntityName = data.custom_entity_name.replaceAll('_', '-')
    query = query.replace('--custom-entity-name', customEntityName)
    let [rec, fields] = await dbConn.query(query, [
      data.record.id,
    ])
    if (!rec.length)
      throw 'not found'
    if (rec.length)
      rec = rec[0]
    if (rec.attachment_files !== '' && rec.attachment_files !== null && rec.attachment_files !== 'NULL')
      rec.attachment_files = JSON.parse(rec.attachment_files)
    result.record = rec
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}


export default {
  filter: filter,
  remove: remove,
  update: update,
  add: add,
  list: list,
  find: find,
  getTotal: getTotal,
  filterRelatedRecord: filterRelatedRecord,
  findRelatedRecord: findRelatedRecord,
  findAttachment: findAttachment,
}
