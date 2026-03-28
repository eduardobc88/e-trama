const create = `
  INSERT INTO
    category
  SET ?;
`

const update = `
  UPDATE
    category
  SET
    updated_at = NOW(),
    name = ?,
    description = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archive = `
  UPDATE
    category
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