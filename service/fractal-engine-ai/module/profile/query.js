const get = `
  SELECT
    u.created_at,
    u.updated_at,
    u.id,
    u.role_id,
    u.language_id,
    u.user_name,
    u.user_email,
    u.user_first_name,
    u.user_last_name,
    u.user_active,
    r.role_name,
    u.user_status,
    u.profile_file_id,
    u.position,
    u.phone,
    u.theme,
    u.area_id,
    u.file_ids,
    r.role_name AS role_id_ref,
    l.language_name AS language_id_ref,
    f.file_name AS profile_file_id_ref,
    (SELECT name FROM area WHERE id = u.area_id) AS area_id_ref
  FROM
    user AS u
  INNER JOIN
    role AS r
  ON
    r.id = u.role_id
  INNER JOIN
    language AS l
  ON
    l.id = u.language_id
  LEFT JOIN
    file AS f
  ON
    f.id = u.profile_file_id
  WHERE
    u.id = ?
  AND
    u.deleted_at = '0000-00-00 00:00:00';
`

const fetchResources = `
  SELECT
    r.name,
    r.path,
    rr.role_id,
    rr.resource_id,
    rr.permission,
    r.menu,
    r.records,
    r.icon,
    IF (r.description = '', (SELECT description FROM custom_entity WHERE name = r.name), r.description) AS description
  FROM
    role_resource AS rr
  INNER JOIN
    resource AS r
  ON
    r.id = rr.resource_id
  WHERE
    rr.role_id = ?
  AND
    r.deleted_at = '0000-00-00 00:00:00'
  AND
    rr.deleted_at = '0000-00-00 00:00:00';
`

export default {
  get: get,
  fetchResources: fetchResources,
}