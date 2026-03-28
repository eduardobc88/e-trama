const fetch = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    name,
    description,
    type,
    custom_list_id,
    custom_entity_id
  FROM
    custom_field
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY id --sort
  LIMIT ?
  OFFSET ?;
`

const get = `
  SELECT
    DATE_FORMAT(cf.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(cf.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    cf.id,
    cf.name,
    cf.description,
    cf.type,
    IFNULL(cf.custom_list_id, 0) AS custom_list_id,
    IFNULL(cf.custom_entity_id, 0) AS custom_entity_id,
    IFNULL(cf.custom_entity_field_id, 0) AS custom_entity_field_id,
    (SELECT name FROM custom_list WHERE id = cf.custom_list_id) AS custom_list_id_ref,
    (SELECT name FROM custom_entity WHERE id = cf.custom_entity_id) AS custom_entity_id_ref,
    (SELECT (SELECT name FROM custom_field WHERE id = cef.custom_field_id) FROM custom_entity_field AS cef WHERE cef.id = cf.custom_entity_field_id) AS custom_entity_field_id_ref
  FROM
    custom_field AS cf
  WHERE
    cf.id = ?
  AND
    cf.deleted_at = '0000-00-00 00:00:00';
`

const search = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    name,
    description,
    type,
    name AS search_show,
    IFNULL(custom_list_id, 0),
    IFNULL(custom_entity_id, 0)
  FROM
    custom_field
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
    custom_field
  WHERE
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  fetch: fetch,
  get: get,
  search: search,
  getTotal: getTotal,
}