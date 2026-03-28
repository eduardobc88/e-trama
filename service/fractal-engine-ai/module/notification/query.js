
const get = `
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
`

const fetch = `
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
  OFFSET ?;
`

const count = `
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
`

const search = `
`


export default {
  get: get,
  fetch: fetch,
  count: count,
  search: search,
}
