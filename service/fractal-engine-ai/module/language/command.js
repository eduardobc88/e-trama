const create = `
  INSERT INTO
    language
  SET ?;
`

const update = `
  UPDATE
    language
  SET
    updated_at = NOW(),
    language_name = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archive = `
  UPDATE
    language
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    id = ?;
`

const createMessage = `
  INSERT INTO
    language_message
  SET ?;
`

const updateMessage = `
  UPDATE
    language_message
  SET
    updated_at = NOW(),
    language_message_key = ?,
    language_message_value = ?
  WHERE
    id = ?
  AND
    language_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archiveMessage = `
  UPDATE
    language_message
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    language_id = ?;
`


export default {
  create: create,
  update: update,
  archive: archive,
  createMessage: createMessage,
  updateMessage: updateMessage,
  archiveMessage: archiveMessage,
}