const MY_SQL_DB = require('../../db/mysqldb')


exports.create = async data => {
  let dbConn = null
  let transaction = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    transaction = await dbConn.getConnection()
    await transaction.beginTransaction()
    let [res, fields] = await transaction.query(`
      INSERT INTO
        notification
      SET ?;`, {
        user_id: data.user_id,
        notification_title: data.notification_title,
        notification_description: data.notification_description,
        notification_type: data.notification_type,
        area_id: data.area_id,
      })
    await transaction.commit()
    let rec = await this.get({
      id: res.insertId,
      user_id: data.user_id,
      area_id: data.area_id,
    })
    return rec
  } catch (err) {
    await transaction.rollback()
    return {
      error: err
    }
  } finally {
    if (transaction !== null)
      transaction.release()
  }
}

exports.get = async data => {
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [res, fields] = await dbConn.query(`
      SELECT
        *
      FROM
        notification
      WHERE
        id = ?
      AND
        user_id = ?
      AND
        area_id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';
      `, [
        data.id,
        data.user_id,
        data.area_id,
      ])
    if (res.length)
      res = res[0]
    return res
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.fetch = async data => {
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = `
    SELECT
      *
    FROM
      notification
    WHERE
      user_id = ?
    AND
      area_id = ?
    AND
      deleted_at = '0000-00-00 00:00:00'
    ORDER BY id sort
    LIMIT ?
    OFFSET ?;`
    query = query.replace('sort', data.sort)
    let [records, fields] = await dbConn.query(query, [
        data.user_id,
        data.area_id,
        data.limit,
        data.skip,
      ])
    return records
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

exports.getTotalRecords = async data => {
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let [record, fields] = await dbConn.query(`
      SELECT
        count(*) AS total
      FROM
        notification
      WHERE
        user_id = ?
      AND
        area_id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';
      `, [
        data.user_id,
        data.area_id,
      ])
    if (record.length)
      record = record[0].total
    return record
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}
