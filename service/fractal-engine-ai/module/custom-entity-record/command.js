const archive = `
  UPDATE
    \`ce---custom-entity-name-record\`
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    id = ?;
`

const update = `
  UPDATE
    \`ce---custom-entity-name-record\`
  SET
    updated_at = NOW(),
    --custom-entity-fields
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const updateFolioNumber = `
  UPDATE
    \`ce---custom-entity-name-record\`
  SET
    updated_at = NOW(),
    folio = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const create = `
  INSERT INTO
    \`ce---custom-entity-name-record\`
  SET ?;
`

const updateCustomEntityNumber = `
  UPDATE
    custom_entity
  SET
    updated_at = NOW(),
    number = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  archive: archive,
  update: update,
  updateFolioNumber: updateFolioNumber,
  create: create,
  updateCustomEntityNumber: updateCustomEntityNumber,
}