
const fetch = `
  SELECT
    DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(c.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    c.id,
    c.state_id,
    c.town_id,
    c.link_name,
    c.local_district,
    c.federal_district,
    c.phone,
    c.town_authority_list_json,
    c.possible_candidate_list_json,
    c.town_actor_list_json,
    c.group_list_json,
    c.group_description,
    c.advice_list_json,
    c.numerals_list_json
  FROM
    card AS c
  WHERE
    c.deleted_at = '0000-00-00 00:00:00'
  ORDER BY c.id sort
  LIMIT ?
  OFFSET ?;
`

const get = `
  SELECT
    DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(c.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    c.id,
    c.state_id,
    c.town_id,
    c.link_name,
    c.local_district,
    c.federal_district,
    c.phone,
    c.town_authority_list_json,
    c.possible_candidate_list_json,
    c.town_actor_list_json,
    c.group_list_json,
    c.group_description,
    c.advice_list_json,
    c.numerals_list_json
  FROM
    card AS c
  WHERE
    c.id = ?
  AND
    c.deleted_at = '0000-00-00 00:00:00';
`

const search = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    link_name,
    town_id,
    CONCAT(id, ' | ', link_name) AS search_show
  FROM
    card
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  AND
    link_name LIKE ?
    LIMIT ?;
`

const count = `
  SELECT
    count(*) AS total
  FROM
    card
  WHERE
    deleted_at = '0000-00-00 00:00:00';
`

const getByTownId = `
  SELECT
    DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(c.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    c.id,
    c.state_id,
    c.town_id,
    c.link_name,
    c.local_district,
    c.federal_district,
    c.phone,
    c.town_authority_list_json,
    c.possible_candidate_list_json,
    c.town_actor_list_json,
    c.group_list_json,
    c.group_description,
    c.advice_list_json,
    c.numerals_list_json
  FROM
    card AS c
  WHERE
    c.town_id = ?
  AND
    c.deleted_at = '0000-00-00 00:00:00';
`

export default {
  fetch: fetch,
  get: get,
  search: search,
  count: count,
  getByTownId: getByTownId,
}
