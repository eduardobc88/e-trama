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
    user_id = ?
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
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const updatePassword = `
  UPDATE
    user
  SET
    user_pass = ?
  WHERE
    id = ?
  AND
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const updateToken = `
  UPDATE
    user
  SET
    user_token = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const updatePasswordByToken = `
  UPDATE
    user
  SET
    user_pass = ?,
    user_token = ''
  WHERE
    user_token = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  create: create,
  update: update,
  remove: remove,
  updatePassword: updatePassword,
  updateToken: updateToken,
  updatePasswordByToken: updatePasswordByToken,
}