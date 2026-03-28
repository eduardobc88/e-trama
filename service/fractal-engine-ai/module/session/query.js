const find = `
  SELECT
    *
  FROM
    session
  WHERE
    data LIKE '%"id":"--user-id"%';
`

const findBySessionId = `
  SELECT
    *
  FROM
    session
  WHERE
    session_id = ?;
`


export default {
  find: find,
  findBySessionId: findBySessionId,
}