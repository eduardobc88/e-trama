const create = `
  INSERT INTO
    custom_list
  SET ?;`

const update = `
  UPDATE
    custom_list
  SET
    updated_at = NOW(),
    name = ?,
    description = ?,
    data = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';`

const remove = `
  UPDATE
    custom_list
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    id = ?;`

export default {
  create,
  update,
  remove,
}