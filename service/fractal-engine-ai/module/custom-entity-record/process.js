import QUERY from './query.js'
import COMMAND from './command.js'


const addCustomEntityRecordFolioNumber = async (dbTransaction, customEntityName, recordId) => {
  let result = {
    error: null,
  }
  try {
    // NOTE: GET CUSTOM ENTITY
    customEntityName = customEntityName.replaceAll('_', '-')
    // NOTE: GET CUSTOM ENTITY
    let [customEntity, _customEntity] = await dbTransaction.query(QUERY.getCustomEntityByName, [
      customEntityName,
    ])
    if (customEntity.length)
      customEntity = customEntity[0]
    // NOTE: UPDATE CUSTOM ENTITY
    let folioNumber = parseInt(customEntity.number) + 1
    await dbTransaction.query(COMMAND.updateCustomEntityNumber, [
      folioNumber,
      customEntity.id,
    ])
    // NOTE: UPDATE CUSTOM ENTITY RECORD
    customEntityName = customEntityName.replaceAll('_', '-')
    let query = COMMAND.updateFolioNumber.replaceAll('--custom-entity-name', customEntityName)
    let padFolioNumber = String(folioNumber).padStart(4, '0')
    let folioNumberFormat = `${ customEntity.prefix }${ customEntity.suffix }/${ padFolioNumber }-${ new Date().getFullYear() }`.toUpperCase()
    await dbTransaction.query(query, [
      folioNumberFormat,
      recordId,
    ])
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}


export default {
  addCustomEntityRecordFolioNumber: addCustomEntityRecordFolioNumber,
}