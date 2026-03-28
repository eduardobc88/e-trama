const searchMany = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    --column-name AS search_show
  FROM
    \`ce---custom-entity-name-record\`
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  AND
  (
    origin_area_id = ?
  OR
    destination_area_id = ?
  )
  AND
    --column-name LIKE ?
  LIMIT ?;
`

const fetchCustomEntityFields = `
  SELECT
    cef.id,
    cef.custom_entity_id,
    cef.custom_field_id,
    cef.active,
    (SELECT name FROM custom_field WHERE id = cef.custom_field_id) AS name,
    (SELECT type FROM custom_field WHERE id = cef.custom_field_id) AS type,
    (SELECT custom_entity_id FROM custom_field WHERE id = cef.custom_field_id) AS custom_entity_id,
    (SELECT custom_entity_field_id FROM custom_field WHERE id = cef.custom_field_id) AS custom_entity_field_id,
    (SELECT custom_list_id FROM custom_field WHERE id = cef.custom_field_id) AS custom_list_id
  FROM
    custom_entity_field AS cef
  WHERE
    cef.custom_entity_id = ?
  AND
    cef.deleted_at = '0000-00-00 00:00:00';
`

const getCustomEntityFieldSearch = `
  SELECT
    cef.id,
    (SELECT name FROM custom_field WHERE id = cef.custom_field_id) AS name
  FROM
    custom_entity_field AS cef
  WHERE
    cef.custom_entity_id = ?
  AND
    cef.is_search = true
  AND
    cef.deleted_at = '0000-00-00 00:00:00';
`

const count = `
  SELECT
    count(*) AS total
  FROM
    \`ce---custom-entity-name-record\`
  WHERE
    deleted_at = '0000-00-00 00:00:00';
`

const fetch = `
  SELECT
    DATE_FORMAT(ce.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(ce.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    DATE_FORMAT(ce.updated_at, '%Y-%m-%d %H:%i:%s') AS deleted_at,
    ce.id,
    ce.created_user_id,
    ce.updated_user_id,
    (SELECT CONCAT(user_first_name, ' ', user_last_name) FROM user WHERE id = ce.created_user_id) AS created_user_id_ref,
    (SELECT CONCAT(user_first_name, ' ', user_last_name) FROM user WHERE id = ce.updated_user_id) AS updated_user_id_ref,
    ce.attachment_files,
    ce.related_records
    --custom-entity-fields
  FROM
    \`ce---custom-entity-name-record\` AS ce
  WHERE
    ce.deleted_at = '0000-00-00 00:00:00'
  ORDER BY id --sort
  LIMIT ?
  OFFSET ?;
`

const search = `
  SELECT
    ce.id
  FROM
    \`ce---custom-entity-name-record\` AS ce
  WHERE
    --search-field LIKE ?
  AND
    ce.deleted_at = '0000-00-00 00:00:00'
  LIMIT ?;
`

const get = `
  SELECT
    DATE_FORMAT(ce.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(ce.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    DATE_FORMAT(ce.deleted_at, '%Y-%m-%d %H:%i:%s') AS deleted_at,
    ce.id,
    ce.created_user_id,
    ce.updated_user_id,
    (SELECT CONCAT(user_first_name, ' ', user_last_name) FROM user WHERE id = ce.created_user_id) AS created_user_id_ref,
    (SELECT CONCAT(user_first_name, ' ', user_last_name) FROM user WHERE id = ce.updated_user_id) AS updated_user_id_ref,
    ce.attachment_files,
    ce.related_records
    --custom-entity-fields
  FROM
    \`ce---custom-entity-name-record\` AS ce
  WHERE
    ce.id = ?
  AND
    ce.deleted_at = '0000-00-00 00:00:00';
`

const getCustomEntityByName = `
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
    ce.resource_name = ?
  AND
    ce.deleted_at = '0000-00-00 00:00:00';
`

const fetchCustomEntity = `
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
    ce.deleted_at = '0000-00-00 00:00:00';
`

const getCustomEntityById = `
  SELECT
    DATE_FORMAT(ce.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(ce.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    ce.id,
    ce.name,
    ce.resource_name,
    ce.description,
    (SELECT id FROM resource WHERE name = ce.resource_name AND deleted_at = '0000-00-00 00:00:00') AS resource_id
  FROM
    custom_entity AS ce
  WHERE
    ce.id = ?
  AND
    ce.deleted_at = '0000-00-00 00:00:00';
`

const getCustomEntityRecordById = `
  SELECT
    --custom-entity-field
  FROM
    \`ce---custom-entity-name-record\`
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const getAttachment = `
  SELECT
    ce.id,
    ce.attachment_files
  FROM
    \`ce---custom-entity-name-record\` AS ce
  WHERE
    ce.id = ?
  AND
    ce.deleted_at = '0000-00-00 00:00:00';
`


export default {
  searchMany: searchMany,
  fetchCustomEntityFields: fetchCustomEntityFields,
  getCustomEntityFieldSearch: getCustomEntityFieldSearch,
  count: count,
  fetch: fetch,
  search: search,
  get: get,
  getCustomEntityByName: getCustomEntityByName,
  fetchCustomEntity: fetchCustomEntity,
  getCustomEntityById: getCustomEntityById,
  getCustomEntityRecordById: getCustomEntityRecordById,
  getAttachment: getAttachment,
}
