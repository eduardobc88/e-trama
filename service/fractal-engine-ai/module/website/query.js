const getRole = `
  SELECT
    *
  FROM
    role
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const fetchRoleResource = `
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

const getArea = `
  SELECT
    *
  FROM
    area
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const getUserByQRCode = `
  SELECT
    id,
    user_first_name,
    phone,
    position
  FROM
    user
  WHERE
    user_active = 1
  AND
    qr_code = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const getUserByUserName = `
  SELECT
    *
  FROM
    user
  WHERE
    user_name = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const fetchRole = `
  SELECT
    id,
    role_name
  FROM
    role
  WHERE
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const fetchLanguage = `
  SELECT
    id,
    language_name
  FROM
    language
  WHERE
    language_name = 'es'
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const getRegistry = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    name,
    paternal_surname,
    maternal_surname,
    section,
    address,
    latitude,
    longitude,
    state_id,
    town_id,
    file_id
  FROM
    registry
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  getRole: getRole,
  fetchRoleResource: fetchRoleResource,
  getArea: getArea,
  getUserByQRCode: getUserByQRCode,
  getUserByUserName: getUserByUserName,
  fetchRole: fetchRole,
  fetchLanguage: fetchLanguage,
  getRegistry: getRegistry,
}