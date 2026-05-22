const create = `
  INSERT INTO
    area
  SET ?;
`

const update = `
  UPDATE
    area
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
    area
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