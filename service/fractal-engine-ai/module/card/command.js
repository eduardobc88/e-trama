const create = `
  INSERT INTO
    card
  SET ?;
`

const update = `
  UPDATE
    card
  SET
    updated_at = NOW(),
    town_id = ?,
    link_name = ?,
    local_district = ?,
    federal_district = ?,
    phone = ?,
    town_authority_list_json = ?,
    possible_candidate_list_json = ?,
    town_actor_list_json = ?,
    group_list_json = ?,
    group_description = ?,
    advice_list_json = ?,
    numerals_list_json = ?
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const archive = `
  UPDATE
    card
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