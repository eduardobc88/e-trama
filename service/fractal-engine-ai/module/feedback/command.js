const create = `
  INSERT INTO
    feedback
  SET ?;
`

const update = `
  UPDATE
    feedback
  SET
    updated_at = NOW(),
    feedback_title = ?,
    feedback_description = ?,
    category_id = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archive = `
  UPDATE
    feedback
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    id = ?;
`

export default {
  create: create,
  update: update,
  archive: archive,
}