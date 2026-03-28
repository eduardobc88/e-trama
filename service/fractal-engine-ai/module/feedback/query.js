const get = `
  SELECT
    DATE_FORMAT(f.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(f.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    f.id,
    f.user_id,
    f.feedback_title,
    f.feedback_description,
    f.category_id,
    u.user_first_name AS user_id_ref,
    (SELECT name FROM category WHERE id = f.category_id) AS category_id_ref
  FROM
    feedback AS f
  INNER JOIN
    user AS u
  ON
    u.id = f.user_id
  WHERE
    f.id = ?
  AND
    f.deleted_at = '0000-00-00 00:00:00';
`

const fetch = `
  SELECT
    DATE_FORMAT(f.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(f.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    f.id,
    f.user_id,
    f.feedback_title,
    f.feedback_description,
    f.category_id,
    u.user_first_name AS user_id_ref,
    (SELECT name FROM category WHERE id = f.category_id) AS category_id_ref
  FROM
    feedback AS f
  INNER JOIN
    user AS u
  ON
    u.id = f.user_id
  WHERE
    f.deleted_at = '0000-00-00 00:00:00'
  ORDER BY id sort
  LIMIT ?
  OFFSET ?;
`

const getTotal = `
  SELECT
    count(*) AS total
  FROM
    feedback
  WHERE
    deleted_at = '0000-00-00 00:00:00';
`

const search = `
    SELECT
      id,
      feedback_title,
      feedback_description
    FROM
      feedback
    WHERE
      deleted_at = '0000-00-00 00:00:00'
    AND
      feedback_title LIKE ?
    OR
      feedback_description LIKE ?
    LIMIT ?;
`

export default {
  get: get,
  fetch: fetch,
  getTotal: getTotal,
  search: search,
}