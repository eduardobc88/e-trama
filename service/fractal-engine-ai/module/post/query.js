const find = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    title,
    excerpt,
    category_id,
    content,
    file_id,
    file_ids,
    user_id,
    status,
    (SELECT name FROM category WHERE id = category_id) AS category_id_ref
  FROM
    post AS p
  WHERE
    --match-prop
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const fetch = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    title,
    excerpt,
    category_id,
    content,
    file_id,
    file_ids,
    user_id,
    status
  FROM
    post
  WHERE
    --match-prop
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY id sort
  LIMIT ?
  OFFSET ?;
`

const count = `
  SELECT
    count(*) AS total
  FROM
    post
  WHERE
    --match-prop
    deleted_at = '0000-00-00 00:00:00';
`

const search = `
  SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    id,
    title,
    excerpt,
    category_id,
    content,
    file_id,
    file_ids,
    user_id,
    status,
    merge(id, ' | ', title) AS search_show
  FROM
    post
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  AND
    title LIKE ?
  --match-prop
  LIMIT ?;
`


export default {
  find: find,
  fetch: fetch,
  count: count,
  search: search,
}