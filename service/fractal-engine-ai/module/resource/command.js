const create = `
  INSERT INTO
    resource
  SET ?;
`

const update = `
  UPDATE
    resource
  SET
    updated_at = NOW(),
    name = ?,
    description = ?,
    path = ?,
    menu = ?,
    records = ?,
    icon = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archive = `
  UPDATE
    resource
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
  archive: archive,
}