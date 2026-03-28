import MY_SQL_DB from '../lib/mysqldb.js'


const getRef = async (record, tableName, colName, colAsName, id) => {
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = `
      SELECT
        ${ colName } AS ${colAsName }
      FROM
        ${ tableName }
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`
    let [res, fields] = await dbConn.query(query, [id])
    if (res.length)
      res = res[0]
    record[colAsName] = res[colAsName]
    return record
  } catch (err) {
    return {
      error: err
    }
  } finally {

  }
}

const getNotificationString = async (userId, roleId) => {
  let index = parseInt(roleId) - 1
  let uids = [0, 0, 0, 0]
  uids[index] = userId
  if (index === 0)
    return uids.join('')

  let newIndex = parseInt(roleId) - 1
  for (let i = index; i >= 0; i--) {
    let uid = uids[i]
    let puid = await getParentUserId(uid)
    newIndex = newIndex - 1
    if (newIndex >= 0)
      uids[newIndex] = puid
    if (puid === 1)
      break
  }
  return uids.join('-')
}

const getParentUserId = async userId => {
  let dbConn = null
  try {
    dbConn = await MY_SQL_DB.getPoolConnection()
    let query = `
      SELECT
        user_id
      FROM
        user
      WHERE
        id = ?
      AND
        deleted_at = '0000-00-00 00:00:00';`
    let [res, fields] = await dbConn.query(query, [userId])
    if (!res.length)
      return 0

    return res[0].user_id
  } catch (err) {
    return 0
  } finally {

  }
}

const putReqBodyIDs = (req, obj) => {
  let params = {
    district_user_id: req.session.user.user_id,
    town_user_id: req.session.user.id,
  }
  params = Object.assign(params, obj)
  return params
}

const getPropNameByRole = req => {
  let roleId = parseInt(req.session.user.role_id)
  if (roleId === 5) // NOTE: COORDINADOR MUNICIPAL
    return `town_user_id = ${ req.session.user.id }`
  if (roleId === 4) // NOTE: COORDINADOR DISTRITAL
    return `district_user_id = ${ req.session.user.id }`
  if (roleId === 3) // NOTE: COORDINADOR ESTATAL
    return ''
  if (roleId === 2) // NOTE: COORDINADOR NACIONAL
    return ''
}


export default {
  getRef: getRef,
  getNotificationString: getNotificationString,
  putReqBodyIDs: putReqBodyIDs,
  getPropNameByRole: getPropNameByRole,
}