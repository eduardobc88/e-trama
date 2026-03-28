const MY_SQL_DB = require('../../db/mysqldb')

exports.fetchState = async data => {
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = `
      SELECT
        id,
        name
      FROM
        state;`
    let [records, fields] = await dbConn.query(query, [
    ])
    return records
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.brigadeStateReport = async data => {
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = `
      SELECT
        u.id AS ID,
        UPPER(CONCAT(u.user_first_name, ' ', u.user_last_name)) AS NOMBRE,
        (SELECT
          count(*)
        FROM
          promoted_${ data.state_id }
        WHERE
          user_id = u.id
        AND
          deleted_at = '0000-00-00 00:00:00'
        AND
          created_at >= ?
        AND
          created_at <= ?) AS TOTAL,
        'NO' AS 'META (15)',
        'NO' AS 'META (20)',
        'NO' AS 'META (25)',
        (SELECT
          count(*)
        FROM
          promoted_${ data.state_id }
        WHERE
          user_id = u.id
        AND
          deleted_at = '0000-00-00 00:00:00'
        AND
          created_at >= ?
        AND
          created_at <= ?) AS ACUMULADO,
        '0' AS 'PORCENTAJE',
        '' AS '',
        '' AS 'DATO',
        '' AS 'VALOR'
      FROM
        user AS u
      WHERE
        --replace
        u.state_id = ?
      AND
        u.role_id = 4
      AND
        u.deleted_at = '0000-00-00 00:00:00';`
    query = query.replace('--replace', data.prop_name)
    let [records, fields] = await dbConn.query(query, [
      data.start_date,
      data.end_date,
      data.fortnight_start_date,
      data.fortnight_end_date,
      data.state_id,
      ])
    return records
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.getNotificationReport = async data => {
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = `
      SELECT
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
        id,
        name,
        email,
        active,
        active_national,
        active_coordinator
      FROM
        notification_report
      WHERE
        name = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`
    let [rec, fields] = await dbConn.query(query, [
        data.name,
      ])
    if (rec.length)
      rec = rec[0]
    if (rec.email !== '' && rec.email !== 'null')
      rec.email = JSON.parse(rec.email)
    else
      rec.email = []
    return rec
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}
