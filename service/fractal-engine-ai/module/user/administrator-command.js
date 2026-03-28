const create = `
  INSERT INTO
    user
  SET ?;
`

const update = `
  UPDATE
    user
  SET
    language_id = ?,
    profile_file_id = ?,
    user_pass_replace,
    role_id = ?,
    user_email = ?,
    user_first_name = ?,
    user_last_name = ?,
    user_name = ?,
    position = ?,
    phone = ?,
    file_ids = ?,
    area_id = ?,
    theme = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const remove = `
  UPDATE
    user
  SET
    deleted_at = NOW()
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  create: create,
  update: update,
  remove: remove,
}