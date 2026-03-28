
const fetch = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    name,
    description,
    gd_folder_id
  FROM
    area
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY id --sort
  LIMIT ?
  OFFSET ?;
`

const get = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    name,
    description,
    gd_folder_id
  FROM
    area
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const search = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    name,
    name AS search_show,
    description
  FROM
    area
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  AND
    name LIKE ?
  LIMIT ?;
`

const count = `
  SELECT
    count(*) AS total
  FROM
    area
  WHERE
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  fetch: fetch,
  get: get,
  search: search,
  count: count,
}
