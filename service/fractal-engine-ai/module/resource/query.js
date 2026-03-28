const get = `
  SELECT
    *
  FROM
    resource
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const fetch = `
  SELECT
    *
  FROM
    resource
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY id sort
  LIMIT ?
  OFFSET ?;
`

const fetchAll = `
  SELECT
    r.created_at,
    r.updated_at,
    r.id,
    r.name,
    r.description,
    r.path,
    r.menu,
    r.records,
    r.icon
  FROM
    role_resource AS rr
  LEFT JOIN
    resource AS r
  ON
    r.id = rr.resource_id
  WHERE
    rr.role_id = ?
  AND
    rr.deleted_at = '0000-00-00 00:00:00'
  ORDER BY rr.id;
`

const search = `
  SELECT
    *
  FROM
    resource
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
    resource
  WHERE
    deleted_at = '0000-00-00 00:00:00';
`

const fetchAllAdmin = `
  SELECT
    *
  FROM
    resource
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY id;
`


export default {
  get: get,
  fetch: fetch,
  fetchAll: fetchAll,
  search: search,
  count: count,
  fetchAllAdmin: fetchAllAdmin,
}