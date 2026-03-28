import MY_SQL_DB from '../../lib/mysqldb.js'
import EVENT_EMITTER from '../../lib/event-emitter.js'


const init = config => {
  EVENT_EMITTER.on(config.resource_name, 'post', data => {
    if (data.custom_entity_name === 'prerrogativa')
      updateAccountPrerrogativa({
        custom_entity_name: data.custom_entity_name,
        old_record: data.old_record,
        record: data.record,
        type: 'post',
      })
    if (data.custom_entity_name === 'transaccion')
      updateAccountFromTransaction({
        custom_entity_name: data.custom_entity_name,
        old_record: null,
        record: data.record,
        type: 'post',
      })
  })
  EVENT_EMITTER.on(config.resource_name, 'put', data => {
    if (data.custom_entity_name === 'prerrogativa')
      updateAccountPrerrogativa({
        custom_entity_name: data.custom_entity_name,
        old_record: data.old_record,
        record: data.record,
        type: 'put',
      })
    if (data.custom_entity_name === 'transaccion')
      updateAccountFromTransaction({
        custom_entity_name: data.custom_entity_name,
        old_record: data.old_record,
        record: data.record,
        type: 'put',
      })
  })
  EVENT_EMITTER.on(config.resource_name, 'delete', data => {
    if (data.custom_entity_name === 'transaccion')
      updateAccountFromTransaction({
        custom_entity_name: data.custom_entity_name,
        old_record: null,
        record: data.record,
        type: 'delete',
      })
    if (data.custom_entity_name === 'prerrogativa')
      updateAccountPrerrogativa({
        custom_entity_name: data.custom_entity_name,
        old_record: data.old_record,
        record: data.record,
        type: 'delete',
      })
  })
}

// NOTE: EVENT HOOK FOR UPDATE ACCOUNT FROM PRERROGATIVAS

const updateAccountPrerrogativa = async data => {
  let dbConn = null
  let transaction = null
  let result = {}
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    let query = ``
    if (data.type === 'put' && data.record.cuenta !== data.old_record.cuenta) {
      let amountDiff = data.record.monto - data.old_record.monto
      // NOTE: GET ACCOUNT FROM OLD_RECORD.CUENTA
      query = `
        SELECT
          id,
          total
        FROM
          \`ce-cuenta-record\`
        WHERE
          id = ?
        AND
          deleted_at = '0000-00-00';
      `
      let [accountARecord, _accountARecord] = await transaction.query(query, [
        data.old_record.cuenta,
      ])
      if (accountARecord.length)
        accountARecord = accountARecord[0]
      // NOTE: GET ACCOUNT FROM RECORD.CUENTA
      query = `
        SELECT
          id,
          total
        FROM
          \`ce-cuenta-record\`
        WHERE
          id = ?
        AND
          deleted_at = '0000-00-00';
      `
      let [accountBRecord, _accountBRecord] = await transaction.query(query, [
        data.record.cuenta,
      ])
      if (accountBRecord.length)
        accountBRecord = accountBRecord[0]
      accountARecord.total = accountARecord.total - data.old_record.monto
      accountBRecord.total = accountBRecord.total + data.record.monto
      // NOTE: UPDATE ACCOUNTS WITH NEW TOTALS
      await updateAccountTotal(transaction, data.old_record.cuenta, accountARecord.total)
      await updateAccountTotal(transaction, data.record.cuenta, accountBRecord.total)
    } else {
      // NOTE: IS THE SAME ACCOUNT
      // NOTE: GET TOTAL PRERROGATIVAS FROM ACCOUNT
      let query = `
        SELECT
          IFNULL(SUM(monto), 0) AS total
        FROM
          \`ce-prerrogativa-record\`
        WHERE
          cuenta = ?
        AND
          deleted_at = '0000-00-00';
      `
      let [record, _record] = await transaction.query(query, [
        data.record.cuenta,
      ])
      if (record.length)
        record = record[0]
      await updateAccountTotal(transaction, data.record.cuenta, record.total)
    }
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    result.error = err
  } finally {
    transaction.release()
    return result
  }
}

// NOTE: EVENT HOOK FOR UPDATE ACCOUNT FROM TRANSACCION

const updateAccountFromTransaction = async data => {
  let dbConn = null
  let transaction = null
  let result = {}
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    if (data.type === 'put') {
      // NOTE: RESTORE TOTAL TO OLD ACCOUNT
      query = `
        SELECT
          id,
          total
        FROM
          \`ce-cuenta-record\`
        WHERE
          id = ?
        AND
          deleted_at = '0000-00-00';
      `
      let [accountRecord, _accountRecord] = await transaction.query(query, [
        data.old_record.cuenta,
      ])
      if (accountRecord.length)
        accountRecord = accountRecord[0]
      accountRecord.total = accountRecord.total + data.old_record.total
      // NOTE: UPDATE OLD ACCOUNT
      query = `
        UPDATE
          \`ce-cuenta-record\`
        SET
          total = ?
        WHERE
          id = ?
        AND
          deleted_at = '0000-00-00';
      `
      let [resUpdate, _resUpdate] = await transaction.query(query, [
        accountRecord.total,
        data.old_record.cuenta,
      ])
      if (resUpdate.affectedRows === 0)
        throw 'no changes were detected'
    }
    // NOTE: GET ACCOUNT
    query = `
      SELECT
        id,
        total
      FROM
        \`ce-cuenta-record\`
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00';
    `
    let [accountRecord, _accountRecord] = await transaction.query(query, [
      data.record.cuenta,
    ])
    if (accountRecord.length)
      accountRecord = accountRecord[0]
    // NOTE: CALC TOTALS
    if (data.type === 'put')
      accountRecord.total = accountRecord.total - data.record.total
    else if (data.type === 'post')
      accountRecord.total = accountRecord.total - data.record.total
    else if (data.type === 'delete')
      accountRecord.total = accountRecord.total + data.record.total
    // NOTE: UPDATE ACCOUNT
    query = `
      UPDATE
        \`ce-cuenta-record\`
      SET
        total = ?
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00';
    `
    let [resUpdate, _resUpdate] = await transaction.query(query, [
      accountRecord.total,
      data.record.cuenta,
    ])
    if (resUpdate.affectedRows === 0)
      throw 'no changes were detected'
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    result.error = err
  } finally {
    transaction.release()
    return result
  }
}

// NOTE: CUSTOM FUNCTIONS

const updateAccountTotal = async (transaction, id, total) => {
  let result = {
    error: null,
  }
  try {
    // NOTE: UPDATE ACCOUNT
    query = `
      UPDATE
        \`ce-cuenta-record\`
      SET
        total = ?
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00';
    `
    let [resUpdate, _resUpdate] = await transaction.query(query, [
      total,
      id,
    ])
    if (resUpdate.affectedRows === 0)
      throw 'no changes were detected'
  } catch (err) {
    result.error = err
  } finally {
    return result
  }
}


export default {
  init: init,
}