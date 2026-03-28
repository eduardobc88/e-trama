const select = `
  SELECT
    *
  FROM
    file
  WHERE
    id = ?
  AND
    area_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const selectPaged = `
  SELECT
    *
  FROM
    file
  WHERE
    area_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY id sort
  LIMIT ?
  OFFSET ?;
`

const search = `
  SELECT
    *
  FROM
    file
  WHERE
    area_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00'
  AND
    file_title LIKE ?
  LIMIT ?;
`

const selectTotal = `
  SELECT
    count(*) AS total
  FROM
    file
  WHERE
    area_id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const selectById = `
  SELECT
    *
  FROM
    file
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`

const selectWithoutArea = `
  SELECT
    *
  FROM
    file
  WHERE
    id = ?
  AND
    deleted_at = '0000-00-00 00:00:00';
`


export default {
  select: select,
  selectPaged: selectPaged,
  search: search,
  selectTotal: selectTotal,
  selectById: selectById,
  selectWithoutArea: selectWithoutArea,
}
