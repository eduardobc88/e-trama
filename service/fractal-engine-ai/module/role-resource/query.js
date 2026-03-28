const get = `
  SELECT
    *
  FROM
    role_resource
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const fetch = `
  SELECT
    *
  FROM
    role_resource
  WHERE
    role_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const countResourcePermissionByName = `
  SELECT
    count(*) AS total
  FROM
    role_resource AS rr
  INNER JOIN
    resource AS r
  ON
    r.id = rr.resource_id
  WHERE
    rr.role_id = ?
  AND
    r.name = ?
  AND
    rr.permission LIKE ?
  AND
    rr.deleted_at = '0000-00-00 00:00:00';
`

const countCustomEntityPermissionByName = `
  SELECT
    COUNT(*) AS total
  FROM
    resource AS r
  JOIN
    role_resource AS rr
  ON
    rr.resource_id = r.id
  WHERE
    rr.role_id = ?
  AND
    r.name = ?
  AND
    rr.permission LIKE ?
  AND
    r.deleted_at = '0000-00-00 00:00:00'
  AND
    rr.deleted_at = '0000-00-00 00:00:00';
`


export default {
  get: get,
  fetch: fetch,
  countResourcePermissionByName: countResourcePermissionByName,
  countCustomEntityPermissionByName: countCustomEntityPermissionByName,
}