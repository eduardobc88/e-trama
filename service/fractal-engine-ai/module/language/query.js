const get = `
  SELECT
    *
  FROM
    language
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const fetch = `
  SELECT
    *
  FROM
    language
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY id sort
  LIMIT ?
  OFFSET ?;
`

const fetchAll = `
  SELECT
    *
  FROM
    language
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY id;
`

const search = `
  SELECT
    id,
    language_name AS search_show
  FROM
    language
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  AND
    language_name LIKE ?
  LIMIT ?;
`

const getTotal = `
  SELECT
    count(*) AS total
  FROM
    language
  WHERE
    deleted_at = '0000-00-00 00:00:00';
`

const fetchMessages = `
  SELECT
    created_at,
    updated_at,
    id,
    language_id,
    language_message_key,
    language_message_value,
    false AS removed
  FROM
    language_message
  WHERE
    language_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  get: get,
  fetch: fetch,
  fetchAll: fetchAll,
  fetchMessages: fetchMessages,
  getTotal: getTotal,
  search: search,
}