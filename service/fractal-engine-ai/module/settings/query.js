const get = `
  SELECT
    id,
    use_google_drive,
    IFNULL(gd_folder_id, '') AS gd_folder_id,
    IFNULL(gd_auth_client_email, '') AS gd_auth_client_email,
    IFNULL(gd_auth_private_key, '') AS gd_auth_private_key,
    items_by_page,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at
  FROM
    settings
  WHERE
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  get: get,
}
