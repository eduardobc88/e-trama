const update = `
  UPDATE
    settings
  SET
    updated_at = NOW(),
    use_google_drive = ?,
    gd_folder_id = ?,
    gd_auth_client_email = ?,
    gd_auth_private_key = ?,
    items_by_page = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  update: update,
}