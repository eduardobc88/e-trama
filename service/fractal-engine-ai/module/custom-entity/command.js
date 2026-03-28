const create = `
  INSERT INTO
    custom_entity
  SET ?;
`

const update = `
  UPDATE
    custom_entity
  SET
    updated_at = NOW(),
    name = ?,
    resource_name = ?,
    description = ?,
    prefix = ?,
    suffix = ?,
    number = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archive = `
  UPDATE
    custom_entity
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    id = ?;
`

const addTable = `
  CREATE TABLE IF NOT EXISTS \`ce---entity-name-record\` (
    created_at DATETIME DEFAULT current_timestamp(),
    updated_at DATETIME DEFAULT current_timestamp(),
    deleted_at DATETIME DEFAULT '0000-00-00 00:00:00',
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    folio VARCHAR(200),
    area_id INT(10) unsigned DEFAULT NULL,
    created_user_id INT(10) UNSIGNED NOT NULL,
    updated_user_id INT(10) UNSIGNED NOT NULL,
    attachment_files TEXT,
    related_records TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (area_id) REFERENCES area (id) ON UPDATE CASCADE  ON DELETE CASCADE,
    FOREIGN KEY (updated_user_id) REFERENCES user (id) ON UPDATE CASCADE  ON DELETE CASCADE,
    FOREIGN KEY (created_user_id) REFERENCES user (id) ON UPDATE CASCADE  ON DELETE CASCADE,
    UNIQUE KEY uc_folio_uk (folio, deleted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`

const addTableColumn = `
  ALTER TABLE
    \`ce---entity-name-record\`
  ADD COLUMN --column --type;
`

const addTableConstraint = `
  ALTER TABLE
    \`ce---entity-name-record\`
  ADD CONSTRAINT
    --reference-name --type (--reference-column);
`

const archiveTableConstraint = `
  ALTER TABLE
    \`ce---entity-name-record\`
  DROP INDEX --reference-name;
`

const archiveTableColumn = `
  ALTER TABLE
    \`ce---entity-name-record\`
  RENAME COLUMN
    --old-column
  TO
    --new-column;
`

const updateTable = `
  ALTER TABLE
  \`--old-entity-name\` RENAME \`--new-entity-name\`;
`

const addCustomEntityField = `
  INSERT INTO
    custom_entity_field
  SET ?;
`

const updateCustomEntityField = `
  UPDATE
    custom_entity_field
  SET
    updated_at = NOW(),
    is_unique = ?,
    is_search = ?,
    active = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archiveCustomEntityField = `
  DELETE FROM
    custom_entity_field
  WHERE
    id = ?;
`

const addResource = `
  INSERT INTO
    resource
  SET ?;
`

const addRoleResource = `
  INSERT INTO
    role_resource
  SET ?;
`

const updateRoleResource = `
  UPDATE
    role_resource
  SET
    updated_at = NOW(),
    permission = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archiveResource = `
  UPDATE
    resource
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    id = ?;
`

const archiveRoleResource = `
  UPDATE
    role_resource
  SET
    deleted_at = NOW()
  WHERE
    resource_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  create: create,
  update: update,
  archive: archive,
  addTable: addTable,
  addTableColumn: addTableColumn,
  addTableConstraint: addTableConstraint,
  archiveTableConstraint: archiveTableConstraint,
  archiveTableColumn: archiveTableColumn,
  updateTable: updateTable,
  addCustomEntityField: addCustomEntityField,
  updateCustomEntityField: updateCustomEntityField,
  archiveCustomEntityField: archiveCustomEntityField,
  addResource: addResource,
  addRoleResource: addRoleResource,
  updateRoleResource: updateRoleResource,
  archiveResource: archiveResource,
  archiveRoleResource: archiveRoleResource,
}