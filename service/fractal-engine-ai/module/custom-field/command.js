const create = `
  INSERT INTO
    custom_field
  SET ?;
`

const update = `
  UPDATE
    custom_field
  SET
    updated_at = NOW(),
    name = ?,
    description = ?,
    type = ?,
    custom_list_id = ?,
    custom_entity_id = ?,
    custom_entity_field_id = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archive = `
  UPDATE
    custom_field
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    id = ?;
`


export default {
  create,
  update,
  archive,
}