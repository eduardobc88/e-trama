
const fetchCouncilior = `
  SELECT
    id,
    municipio,
    bloque,
    regidores,
    h1,
    m1,
    h2,
    m2,
    h3,
    m3,
    h4,
    m4,
    h5,
    m5
  FROM
    regidores
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY
    id
  DESC;
`

const fetchCandidate = `
  SELECT
    id,
    no_lista,
    distrito_local,
    bloque,
    municipio,
    nombre,
    felefono,
    posible_cargo,
    genero,
    acc_afirmativa,
    observaciones,
    referente,
    tipo
  FROM
    candidatos
  WHERE
    tipo = ?
  AND
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY
    id
  DESC;
`

const fetchBase = `
  SELECT
    id,
    no_lista,
    distrito_local,
    bloque,
    municipio,
    nombre,
    felefono,
    posible_cargo,
    genero,
    acc_afirmativa,
    regidor_actual,
    referente
  FROM
    base
  WHERE
    deleted_at = '0000-00-00 00:00:00'
  ORDER BY
    id
  DESC;
`


export default {
  fetchCouncilior: fetchCouncilior,
  fetchCandidate: fetchCandidate,
  fetchBase: fetchBase,
}
