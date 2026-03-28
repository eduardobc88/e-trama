const insert = `
  INSERT INTO
    file
  SET ?;
`

const update = `
  UPDATE
    file
  SET
    updated_at = NOW(),
    file_title = ?,
    file_description = ?
  WHERE
    id = ?
  AND
    area_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const remove = `
  UPDATE
    file
  SET
    deleted_at = NOW()
  WHERE
    id = ?
  AND
    area_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  insert: insert,
  update: update,
  remove: remove,
}