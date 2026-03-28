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
    u.user_pass,
    r.role_name,
    u.user_status,
    u.profile_file_id,
    u.position,
    u.phone,
    u.file_ids,
    u.area_id,
    u.theme,
    (SELECT gd_folder_id FROM area WHERE id = u.area_id) AS gd_folder_id,
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
    u.user_id = ?
  AND
    u.deleted_at = '0000-00-00 00:00:00';
`

const getByUserName = `
  SELECT
    *
  FROM
    user
  WHERE
    user_name = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const fetch = `
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
    u.user_pass,
    r.role_name,
    u.user_status,
    u.profile_file_id,
    u.position,
    u.phone,
    u.area_id,
    u.theme,
    (SELECT gd_folder_id FROM area WHERE id = u.area_id) AS area_id_ref gd_folder_id,
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
    u.user_id = ?
  AND
    u.deleted_at = '0000-00-00 00:00:00'
  ORDER BY u.id sort
  LIMIT ?
  OFFSET ?;
`

const search = `
  SELECT
    created_at,
    updated_at,
    id,
    role_id,
    language_id,
    user_name,
    user_email,
    user_first_name,
    user_last_name,
    user_active,
    user_status,
    area_id,
    theme
  FROM
    user
  WHERE
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00'
  AND
    user_first_name LIKE ?
  LIMIT ?;
`

const getTotal = `
  SELECT
    count(*) AS total
  FROM
    user
  WHERE
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const getById = `
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
    u.user_pass,
    r.role_name,
    u.user_status,
    u.profile_file_id,
    u.position,
    u.phone,
    u.area_id,
    u.theme,
    u.file_ids,
    (SELECT gd_folder_id FROM area WHERE id = u.area_id) AS area_id_ref gd_folder_id,
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
    u.deleted_at = '0000-00-00 00:00:00'
`

const getByEmail = `
  SELECT
    *
  FROM
    user
  WHERE
    user_email = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const getTotalByToken = `
  SELECT
    count(*) AS total
  FROM
    user
  WHERE
    user_token = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const getByToken = `
  SELECT
    id,
    user_email,
    user_first_name
  FROM
    user
  WHERE
    user_token = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  get: get,
  getByUserName: getByUserName,
  fetch: fetch,
  search: search,
  getTotal: getTotal,
  getById: getById,
  getByEmail: getByEmail,
  getTotalByToken: getTotalByToken,
  getByToken: getByToken,
}