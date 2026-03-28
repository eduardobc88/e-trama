const create = `
  INSERT INTO
    role
  SET ?;
`

const update = `
  UPDATE
    role
  SET
    updated_at = NOW(),
    role_name = ?
  WHERE
    id = ?
  AND
    user_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archive = `
  UPDATE
    role
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    id = ?
  AND
    user_id = ?;
`

const createRoleResource = `
  INSERT INTO
    role_resource
  SET ?;
`

const archiveRoleResource = `
  UPDATE
    role_resource
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    id = ?
  AND
    role_id = ?;
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
    role_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archiveAllRoleResources = `
  UPDATE
    role_resource
  SET
    updated_at = NOW(),
    deleted_at = NOW()
  WHERE
    role_id = ?;
`


export default {
  create: create,
  update: update,
  archive: archive,
  createRoleResource: createRoleResource,
  archiveRoleResource: archiveRoleResource,
  updateRoleResource: updateRoleResource,
  archiveAllRoleResources: archiveAllRoleResources,
}
