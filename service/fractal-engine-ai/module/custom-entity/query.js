const fetch = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    name,
    resource_name,
    description,
    prefix,
    suffix,
    number
  FROM
    custom_entity
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY id --sort
  LIMIT ?
  OFFSET ?;
`

const get = `
  SELECT
    DATE_FORMAT(ce.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(ce.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    ce.id,
    ce.name,
    ce.resource_name,
    ce.description,
    ce.prefix,
    ce.suffix,
    ce.number,
    (SELECT id FROM resource WHERE name = ce.resource_name AND deleted_at = '0000-00-00 00:00:00') AS resource_id
  FROM
    custom_entity AS ce
  WHERE
    ce.id = ?
  AND
    ce.deleted_at = '0000-00-00 00:00:00';
`

const getByName = `
  SELECT
    DATE_FORMAT(ce.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(ce.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    ce.id,
    ce.name,
    ce.resource_name,
    ce.description,
    ce.prefix,
    ce.suffix,
    ce.number,
    (SELECT id FROM resource WHERE name = ce.resource_name AND deleted_at = '0000-00-00 00:00:00') AS resource_id
  FROM
    custom_entity AS ce
  WHERE
    ce.name = ?
  AND
    ce.deleted_at = '0000-00-00 00:00:00';
`

const search = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    name,
    resource_name,
    name AS search_show,
    description,
    prefix,
    suffix,
    number
  FROM
    custom_entity
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  AND
    name LIKE ?
  LIMIT ?;
`

const getTotal = `
  SELECT
    count(*) AS total
  FROM
    custom_entity
  WHERE
    deleted_at = '0000-00-00 00:00:00';
`

const searchCustomEntityFields = `
  SELECT
    cef.id,
    cef.custom_entity_id,
    cef.custom_field_id,
    cef.is_unique,
    cef.is_search,
    cf.name AS search_show
  FROM
    custom_entity_field AS cef
  RIGHT JOIN
    custom_field AS cf
  ON
    cf.id = cef.custom_field_id
  WHERE
    cef.custom_entity_id = ?
  AND
    cf.name LIKE ?
  AND
    cef.deleted_at = '0000-00-00 00:00:00'
  LIMIT ?;
`

const fetchCustomEntityFields = `
  SELECT
    cef.id,
    cef.custom_entity_id,
    cef.custom_field_id,
    cef.active,
    cef.is_unique,
    cef.is_search,
    (SELECT name FROM custom_field WHERE id = cef.custom_field_id) AS name,
    (SELECT type FROM custom_field WHERE id = cef.custom_field_id) AS type,
    (SELECT custom_entity_id FROM custom_field WHERE id = cef.custom_field_id) AS custom_entity_id,
    (SELECT custom_list_id FROM custom_field WHERE id = cef.custom_field_id) AS custom_list_id
  FROM
    custom_entity_field AS cef
  WHERE
    cef.custom_entity_id = ?
  AND
    cef.deleted_at = '0000-00-00 00:00:00';
`

const fetchCustomEntityRolePermissions = `
  SELECT
     rr.id,
    rr.resource_id,
    rr.role_id,
    (SELECT role_name FROM role WHERE id = rr.role_id) AS role_name,
    rr.permission
  FROM
    resource AS r
  JOIN
    role_resource AS rr
  ON
    rr.resource_id = r.id
  WHERE
    r.name = ?
  AND
    r.deleted_at = '0000-00-00 00:00:00'
  AND
    rr.deleted_at = '0000-00-00 00:00:00';
`


export default {
  fetch: fetch,
  get: get,
  getByName: getByName,
  search: search,
  getTotal: getTotal,
  searchCustomEntityFields: searchCustomEntityFields,
  fetchCustomEntityFields: fetchCustomEntityFields,
  fetchCustomEntityRolePermissions: fetchCustomEntityRolePermissions,
}
