const create = `
  INSERT INTO
    post
  SET ?;
`

const update = `
  UPDATE
    post
  SET
    updated_at = NOW(),
    user_id = ?,
    title = ?,
    excerpt = ?,
    content = ?,
    file_id = ?,
    file_ids = ?,
    category_id = ?,
    status = ?
  WHERE
    --match-prop
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archive = `
  UPDATE
    post
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    --match-prop
    id = ?;
`


export default {
  create: create,
  update: update,
  archive: archive,
}