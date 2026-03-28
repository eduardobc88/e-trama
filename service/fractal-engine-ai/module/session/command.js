const remove = `
  SELECT
    *
  FROM
    session
  WHERE
    session_id <> ?
  AND
    data LIKE '%"id":"--user-id"%';
`

const updateSessionData = `
  UPDATE
    session
  SET
    data = ?
  WHERE
    session_id = ?;
`

const updateUserStatus = `
  UPDATE
    user
  SET
    user_status = ?
  WHERE
    id = ?;
`

const removeBySessionId = `
  DELETE FROM
    session
  WHERE
    session_id = ?;
`


export default {
  remove: remove,
  updateSessionData: updateSessionData,
  updateUserStatus: updateUserStatus,
  removeBySessionId: removeBySessionId,
}