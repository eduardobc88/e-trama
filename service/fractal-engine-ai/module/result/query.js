
const fetchByStateName = `
  SELECT
    s.id AS state_id,
    t.town_id AS id,
    t.name,
    r.town_id,
    r.pan,
    r.pri,
    r.prd,
    r.pt,
    r.pvem,
    r.mc,
    r.morena,
    r.pes,
    r.rsp,
    r.fxm,
    r.pan_pri_prd,
    r.pan_pri,
    r.pan_prd,
    r.pri_prd,
    r.pt_morena,
    r.candidatos_no_registrados,
    r.votos_nulos,
    r.votos_validos,
    r.total_votos,
    r.lista_nominal,
    r.participacion_ciudadana,
    r.year
  FROM
    state AS s
  JOIN
    town AS t
  ON
    t.state_id = s.id
  LEFT JOIN
    result AS r
  ON
    r.town_id = t.town_id
  WHERE
    s.name LIKE ?
  GROUP BY
    t.name;
`

const getDistrictSectionByTownId = `
  SELECT
    d.local_district
  FROM
    district_section AS d
  WHERE
    d.town_id = ?
  GROUP BY
    d.local_district;
`

export default {
  fetchByStateName: fetchByStateName,
  getDistrictSectionByTownId: getDistrictSectionByTownId,
}
