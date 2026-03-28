const get = `
  SELECT
    *
  FROM
    user
  WHERE
    api_key = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`
