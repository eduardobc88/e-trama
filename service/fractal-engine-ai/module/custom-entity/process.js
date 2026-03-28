import COMMAND from './command.js'


const addCustomEntity = async (dbTransaction, entityName) =>  {
  let response = {
    error: null,
  }
  try {
    let query = ''
    entityName = entityName.replaceAll(' ', '-')
    query = COMMAND.addTable.replaceAll('--entity-name', entityName)
    await dbTransaction.query(query)
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const updateCustomEntity = async (dbTransaction, oldEntityName, newEntityName) =>  {
  let response = {
    error: null,
  }
  try {
    let query = ''
    oldEntityName = oldEntityName.replaceAll(' ', '-')
    newEntityName = newEntityName.replaceAll(' ', '-')
    // NOTE: RECORD
    query = COMMAND.updateTable.replaceAll('--old-entity-name', `ce-${ oldEntityName }-record`)
    query = query.replaceAll('--new-entity-name', `ce-${ newEntityName }-record`)
    await dbTransaction.query(query)
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const removeCustomEntity = async (dbTransaction, entityName) =>  {
  let response = {
    error: null,
  }
  try {
    let query = ''
    let currentDate = Date.now()
    entityName = entityName.replaceAll(' ', '-')
    // NOTE: RECORD
    query = COMMAND.updateTable.replaceAll('--old-entity-name', `ce-${ entityName }-record`)
    query = query.replaceAll('--new-entity-name', `ce-${ entityName }-record-${ currentDate }`)
    await dbTransaction.query(query)
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const addCustomEntityColumn = async (dbTransaction, entityName, customFieldName, customFieldType, isUnique) =>  {
  let response = {
    error: null,
  }
  try {
    entityName = entityName.replaceAll(' ', '-')
    customFieldName = customFieldName.replaceAll(' ', '_')
    let query = ''
    // NOTE: RECORD
    let type = getType(customFieldType)
    query = COMMAND.addTableColumn.replaceAll('--entity-name', entityName)
    query = query.replaceAll('--column', customFieldName)
    query = query.replaceAll('--type', type)
    await dbTransaction.query(query)
    // NOTE: CREATE CUSTOM FIELD CONSTRAINT UNIQUE
    if (isUnique) {
      query = COMMAND.addTableConstraint.replaceAll('--entity-name', entityName)
      query = query.replaceAll('--reference-name', `unique_${ customFieldName }`)
      query = query.replaceAll('--type', 'UNIQUE')
      query = query.replaceAll('--reference-column', customFieldName)
      await dbTransaction.query(query)
    }
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const removeCustomEntityColumn = async (dbTransaction, entityName, customFieldName) =>  {
  let response = {
    error: null,
  }
  try {
    let currentDate = Date.now()
    entityName = entityName.replaceAll(' ', '-')
    customFieldName = customFieldName.replaceAll(' ', '_')
    let query = ''
    // NOTE: RECORD
    query = COMMAND.archiveTableColumn.replaceAll('--entity-name', entityName)
    query = query.replaceAll('--old-column', customFieldName)
    query = query.replaceAll('--new-column', `${ currentDate }_${ customFieldName }`)
    await dbTransaction.query(query)
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const addResource = async (dbTransaction, name, description) => {
  let response = {
    id: 0,
    error: null,
  }
  try {
    let [result] = await dbTransaction.query(COMMAND.addResource, {
      name: name,
      description: description,
      path: name,
      menu: 1,
      records: 1,
    })
    response.id = result.insertId
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const addRoleResource = async (dbTransaction, roleResource) => {
  let response = {
    id: 0,
    error: null,
  }
  try {
    let [result] = await dbTransaction.query(COMMAND.addRoleResource, roleResource)
    response.id = result.insertId
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const updateRoleResource = async (dbTransaction, roleResourceId, permission) => {
  let response = {
    id: 0,
    error: null,
  }
  try {
    await dbTransaction.query(COMMAND.updateRoleResource, [
      permission,
      roleResourceId,
    ])
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const addOrRemoveCustomEntityColumnUnique = async (dbTransaction, entityName, customFieldName, isUnique) =>  {
  let response = {
    error: null,
  }
  try {
    entityName = entityName.replaceAll(' ', '-')
    customFieldName = customFieldName.replaceAll(' ', '_')
    let query = ''
    if (isUnique) {
      // NOTE: ADD
      query = COMMAND.addTableConstraint.replaceAll('--entity-name', entityName)
      query = query.replaceAll('--reference-name', `unique_${ customFieldName }`)
      query = query.replaceAll('--type', 'UNIQUE')
      query = query.replaceAll('--reference-column', customFieldName)
    } else {
      // NOTE: DROP
      query = COMMAND.archiveTableConstraint.replaceAll('--entity-name', entityName)
      query = query.replaceAll('--reference-name', `unique_${ customFieldName }`)
    }
    await dbTransaction.query(query)
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const removeRoleResource = async (dbTransaction, roleResourceId) => {
  let response = {
    id: 0,
    error: null,
  }
  try {
    await dbTransaction.query(COMMAND.archiveRoleResource, [
      roleResourceId,
    ])
  } catch (err) {
    response.error = err
  } finally {
    return response
  }
}

const getType = customFieldType => {
  let type = ''
  switch (customFieldType) {
    case 'file':
      type = 'INT(10) UNSIGNED'
      break
    case 'text':
      type = 'VARCHAR(200)'
      break
    case 'textarea':
      type = 'VARCHAR(1000)'
      break
    case 'number':
      type = 'DOUBLE(12, 4)' // NOTE: 99999999.9999
      break
    case 'checkbox':
      type = 'TINYINT DEFAULT 0'
      break
    case 'date':
      type = 'DATETIME DEFAULT NULL'
      break
    case 'list':
      type = 'VARCHAR(200) DEFAULT ""'
      break
    case 'entity':
      type = 'INT(10) UNSIGNED'
      break
  }
  return type
}


export default {
  addCustomEntity: addCustomEntity,
  updateCustomEntity: updateCustomEntity,
  removeCustomEntity: removeCustomEntity,
  addCustomEntityColumn: addCustomEntityColumn,
  removeCustomEntityColumn: removeCustomEntityColumn,
  addResource: addResource,
  addRoleResource: addRoleResource,
  updateRoleResource: updateRoleResource,
  removeRoleResource: removeRoleResource,
  addOrRemoveCustomEntityColumnUnique: addOrRemoveCustomEntityColumnUnique,
}
