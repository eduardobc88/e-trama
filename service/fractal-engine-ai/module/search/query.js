 const searchFile = `
  SELECT
    'file' AS item_model,
    file_title AS item_title,
    id AS item_id,
    'perm_media' AS item_icon
  FROM
    file
  WHERE
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00'
  AND
    file_title LIKE ?
  LIMIT 5;
`

const searchUser = `
  SELECT
    'user' AS item_model,
    user_first_name AS item_title,
    id AS item_id,
    'people' AS item_icon
  FROM
    user
  WHERE
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00'
  AND
    user_first_name LIKE ?
  LIMIT 5;
`

const searchResource = `
  SELECT
    'resource' AS item_model,
    name AS item_title,
    id AS item_id,
    'stack' AS item_icon
  FROM
    resource
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  AND
    name LIKE ?
  LIMIT 5;
`

const searchRole = `
  SELECT
    'role' AS item_model,
    role_name AS item_title,
    id AS item_id,
    'security' AS item_icon
  FROM
    role
  WHERE
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00'
  AND
    role_name LIKE ?
  LIMIT 5;
`

const searchLanguage = `
  SELECT
    'language' AS item_model,
    language_name AS item_title,
    id AS item_id,
    'language' AS item_icon
  FROM
    language
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  AND
    language_name LIKE ?
  LIMIT 5;
`

const searchCustomEntityRecord = `
  SELECT
    '--custom-entity-name' AS item_model,
    folio AS item_title,
    id AS item_id,
    'stack' AS item_icon
  FROM
    --table-name
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  AND
  (
    alternative_folio LIKE ?
  OR
    folio LIKE ?
  OR
    personas LIKE ?
  OR
    subject LIKE ?
  )
  LIMIT 5;
`

const fetchRoleResources = `
  SELECT
    r.name AS model
  FROM
    role_resource AS rr
  LEFT JOIN
    resource AS r
  ON
    r.id = rr.resource_id
  WHERE
    rr.role_id = ?
  AND
    r.name NOT LIKE "%s"
  AND
    rr.permission LIKE '%r%'
  AND
    rr.deleted_at = '0000-00-00 00:00:00';
`


export default {
  searchFile: searchFile,
  searchUser: searchUser,
  searchResource: searchResource,
  searchRole: searchRole,
  searchLanguage: searchLanguage,
  searchCustomEntityRecord: searchCustomEntityRecord,
  fetchRoleResources: fetchRoleResources,
}