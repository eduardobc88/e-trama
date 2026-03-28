const get = `
  SELECT
    *
  FROM
    role
  WHERE
    id = ?
  AND
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const getRoleResources = `
  SELECT
    created_at,
    updated_at,
    id,
    role_id,
    resource_id,
    permission,
    false AS removed
  FROM
    role_resource
  WHERE
    role_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const fetch = `
  SELECT
    *
  FROM
    role
  WHERE
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY id sort
  LIMIT ?
  OFFSET ?;
`

const fetchAll = `
  SELECT
    *
  FROM
    role
  WHERE
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY id;
`

const count = `
  SELECT
    count(*) AS total
  FROM
    role
  WHERE
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const search = `
  SELECT
    id,
    role_name AS search_show
  FROM
    role
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  AND
    --match-replace
    role_name LIKE ?
  LIMIT ?;
`

const getRoleResourceResources = `
  SELECT
    r.name,
    r.path,
    rr.role_id,
    rr.resource_id,
    rr.permission
  FROM
    role_resource AS rr
  INNER JOIN
    resource AS r
  ON
    r.id = rr.resource_id
  WHERE
    rr.role_id = ?
  AND
    rr.deleted_at = '0000-00-00 00:00:00';
`


export default {
  get: get,
  getRoleResources: getRoleResources,
  fetch: fetch,
  fetchAll: fetchAll,
  count: count,
  search: search,
  getRoleResourceResources: getRoleResourceResources,
}
