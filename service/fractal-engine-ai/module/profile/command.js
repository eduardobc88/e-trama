const update = `
  UPDATE
    user
  SET
    language_id = ?,
    profile_file_id = ?,
    user_pass_replace,
    user_email = ?,
    user_first_name = ?,
    user_last_name = ?,
    position = ?,
    phone = ?,
    theme = ?,
    file_ids = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  update: update,
}