const fetchElectionTypes = `
  SELECT
    scope,
    election,
    type
  FROM
    result_seccion
  GROUP BY
    scope,
    election,
    type;
`

const fetchElectionResultByFederalDistrict = `
  SELECT
    FDF.name AS district_id,
    FDF.header,
    SUM(RS.mc) AS votos_mc,
    SUM(RS.morena) AS votos_morena,
    SUM(RS.pan) AS votos_pan,
    SUM(RS.pes) AS votos_pes,
    SUM(RS.prd) AS votos_prd,
    SUM(RS.pri) AS votos_pri,
    SUM(RS.pt) AS votos_pt,
    SUM(RS.casillas) AS casillas,
    SUM(RS.lista_nominal) AS lista_nominal,
    SUM(RS.num_votos_nulos) AS num_votos_nulos,
    SUM(RS.num_votos_validos) AS num_votos_validos,
    SUM(RS.total_votos) AS total_votos,
	  GREATEST (
      COALESCE(SUM(RS.mc), 0),
      COALESCE(SUM(RS.morena), 0),
      COALESCE(SUM(RS.pan), 0),
      COALESCE(SUM(RS.pes), 0),
      COALESCE(SUM(RS.prd), 0),
      COALESCE(SUM(RS.pri), 0),
      COALESCE(SUM(RS.pt), 0)
    ) AS ganador_votos,
	  CASE GREATEST(
      COALESCE(SUM(RS.mc), 0),
      COALESCE(SUM(RS.morena), 0),
      COALESCE(SUM(RS.pan), 0),
      COALESCE(SUM(RS.pes), 0),
      COALESCE(SUM(RS.prd), 0),
      COALESCE(SUM(RS.pri), 0),
      COALESCE(SUM(RS.pt), 0)
    )
      WHEN 0 THEN 'sin votos'
      WHEN COALESCE(SUM(RS.mc), 0) THEN 'mc'
      WHEN COALESCE(SUM(RS.morena), 0) THEN 'morena'
      WHEN COALESCE(SUM(RS.pan), 0) THEN 'pan'
      WHEN COALESCE(SUM(RS.pes), 0) THEN 'pes'
      WHEN COALESCE(SUM(RS.prd), 0) THEN 'prd'
      WHEN COALESCE(SUM(RS.pri), 0) THEN 'pri'
      WHEN COALESCE(SUM(RS.pt), 0) THEN 'pt'
    END AS ganador
  FROM
    federal_district_feature AS FDF
  LEFT JOIN
    town_feature AS TF
  ON
	  FIND_IN_SET(FDF.name, TF.district_f_id) > 0
  LEFT JOIN
    result_seccion AS RS
  ON
    RS.town_id = TF.town_id
  AND
    RS.scope = ?
  AND
    RS.election = ?
  AND
    RS.type = ?
  GROUP BY
    FDF.name;
`

const fetchElectionResultByLocalDistrict = `
  SELECT
    LDF.name AS district_id,
	  LDF.header,
	  SUM(RS.mc) AS votos_mc,
    SUM(RS.morena) AS votos_morena,
    SUM(RS.pan) AS votos_pan,
    SUM(RS.pes) AS votos_pes,
    SUM(RS.prd) AS votos_prd,
    SUM(RS.pri) AS votos_pri,
    SUM(RS.pt) AS votos_pt,
    SUM(RS.casillas) AS casillas,
    SUM(RS.lista_nominal) AS lista_nominal,
    SUM(RS.num_votos_nulos) AS num_votos_nulos,
    SUM(RS.num_votos_validos) AS num_votos_validos,
    SUM(RS.total_votos) AS total_votos,
	  GREATEST (
      COALESCE(SUM(RS.mc), 0),
      COALESCE(SUM(RS.morena), 0),
      COALESCE(SUM(RS.pan), 0),
      COALESCE(SUM(RS.pes), 0),
      COALESCE(SUM(RS.prd), 0),
      COALESCE(SUM(RS.pri), 0),
      COALESCE(SUM(RS.pt), 0)
    ) AS ganador_votos,
	  CASE GREATEST(
      COALESCE(SUM(RS.mc), 0),
      COALESCE(SUM(RS.morena), 0),
      COALESCE(SUM(RS.pan), 0),
      COALESCE(SUM(RS.pes), 0),
      COALESCE(SUM(RS.prd), 0),
      COALESCE(SUM(RS.pri), 0),
      COALESCE(SUM(RS.pt), 0)
    )
      WHEN 0 THEN 'sin votos'
      WHEN COALESCE(SUM(RS.mc), 0) THEN 'mc'
      WHEN COALESCE(SUM(RS.morena), 0) THEN 'morena'
      WHEN COALESCE(SUM(RS.pan), 0) THEN 'pan'
      WHEN COALESCE(SUM(RS.pes), 0) THEN 'pes'
      WHEN COALESCE(SUM(RS.prd), 0) THEN 'prd'
      WHEN COALESCE(SUM(RS.pri), 0) THEN 'pri'
      WHEN COALESCE(SUM(RS.pt), 0) THEN 'pt'
    END AS ganador
  FROM
    local_district_feature AS LDF
  LEFT JOIN
    town_feature AS TF
  ON
	  FIND_IN_SET(LDF.name, TF.district_l_id) > 0
  LEFT JOIN
    result_seccion AS RS
  ON
    RS.town_id = TF.town_id
  AND
    RS.scope = ?
  AND
    RS.election = ?
  AND
    RS.type = ?
  GROUP BY
    LDF.name;
`

const fetchElectionResultByTown = `
  SELECT
    RS.id,
    RS.type,
    RS.election,
    RS.scope,
    RS.town_id,
    RS.municipio,
    SUM(RS.mc) AS votos_mc,
    SUM(RS.morena) AS votos_morena,
    SUM(RS.pan) AS votos_pan,
    SUM(RS.pes) AS votos_pes,
    SUM(RS.prd) AS votos_prd,
    SUM(RS.pri) AS votos_pri,
    SUM(RS.pt) AS votos_pt,
    SUM(RS.casillas) AS casillas,
    SUM(RS.lista_nominal) AS lista_nominal,
    SUM(RS.num_votos_nulos) AS num_votos_nulos,
    SUM(RS.num_votos_validos) AS num_votos_validos,
    SUM(RS.total_votos) AS total_votos,
	  GREATEST (
      COALESCE(SUM(RS.mc), 0),
      COALESCE(SUM(RS.morena), 0),
      COALESCE(SUM(RS.pan), 0),
      COALESCE(SUM(RS.pes), 0),
      COALESCE(SUM(RS.prd), 0),
      COALESCE(SUM(RS.pri), 0),
      COALESCE(SUM(RS.pt), 0)
    ) AS ganador_votos,
	  CASE GREATEST(
      COALESCE(SUM(RS.mc), 0),
      COALESCE(SUM(RS.morena), 0),
      COALESCE(SUM(RS.pan), 0),
      COALESCE(SUM(RS.pes), 0),
      COALESCE(SUM(RS.prd), 0),
      COALESCE(SUM(RS.pri), 0),
      COALESCE(SUM(RS.pt), 0)
    )
      WHEN 0 THEN 'sin votos'
      WHEN COALESCE(SUM(RS.mc), 0) THEN 'mc'
      WHEN COALESCE(SUM(RS.morena), 0) THEN 'morena'
      WHEN COALESCE(SUM(RS.pan), 0) THEN 'pan'
      WHEN COALESCE(SUM(RS.pes), 0) THEN 'pes'
      WHEN COALESCE(SUM(RS.prd), 0) THEN 'prd'
      WHEN COALESCE(SUM(RS.pri), 0) THEN 'pri'
      WHEN COALESCE(SUM(RS.pt), 0) THEN 'pt'
    END AS ganador
  FROM
    town_feature AS TF
  INNER JOIN
    result_seccion AS RS
  ON
    RS.town_id = TF.town_id
  AND
    RS.scope = ?
  AND
    RS.election = ?
  AND
    RS.type = ?
  GROUP BY
    RS.town_id;
`

const fetchElectionResultBySection = `
  SELECT
    RS.id,
    RS.type,
    RS.election,
    RS.scope,
    FDF.header,
    SF.district_f_id,
    SF.district_l_id,
    RS.town_id,
    RS.municipio,
    SF.section_id,
    RS.mc AS votos_mc,
    RS.morena AS votos_morena,
    RS.pan AS votos_pan,
    RS.pes AS votos_pes,
    RS.prd AS votos_prd,
    RS.pri AS votos_pri,
    RS.pt AS votos_pt,
    RS.casillas,
    RS.lista_nominal,
    RS.num_votos_nulos,
    RS.num_votos_validos,
    RS.total_votos,
	  GREATEST (
      COALESCE(RS.mc, 0),
      COALESCE(RS.morena, 0),
      COALESCE(RS.pan, 0),
      COALESCE(RS.pes, 0),
      COALESCE(RS.prd, 0),
      COALESCE(RS.pri, 0),
      COALESCE(RS.pt, 0)
    ) AS ganador_votos,
	  CASE GREATEST(
      COALESCE(RS.mc, 0),
      COALESCE(RS.morena, 0),
      COALESCE(RS.pan, 0),
      COALESCE(RS.pes, 0),
      COALESCE(RS.prd, 0),
      COALESCE(RS.pri, 0),
      COALESCE(RS.pt, 0)
    )
      WHEN 0 THEN 'sin votos'
      WHEN COALESCE(RS.mc, 0) THEN 'mc'
      WHEN COALESCE(RS.morena, 0) THEN 'morena'
      WHEN COALESCE(RS.pan, 0) THEN 'pan'
      WHEN COALESCE(RS.pes, 0) THEN 'pes'
      WHEN COALESCE(RS.prd, 0) THEN 'prd'
      WHEN COALESCE(RS.pri, 0) THEN 'pri'
      WHEN COALESCE(RS.pt, 0) THEN 'pt'
    END AS ganador
  FROM
    section_feature AS SF
  LEFT JOIN
    federal_district_feature AS FDF
  ON
    FDF.district_id = SF.district_f_id
  LEFT JOIN
    result_seccion AS RS
  ON
    RS.scope = ?
  AND
    RS.election = ?
  AND
    RS.type = ?
  AND
    RS.seccion = SF.section_id;
`

const fetchElectionResult = `
  SELECT
    *
  FROM
    result_seccion
  WHERE
    scope = ?
  AND
    election = ?
  AND
    type = ?;
`

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
  fetchElectionTypes: fetchElectionTypes,
  fetchElectionResultByFederalDistrict: fetchElectionResultByFederalDistrict,
  fetchElectionResultByLocalDistrict: fetchElectionResultByLocalDistrict,
  fetchElectioResultByTown: fetchElectionResultByTown,
  fetchElectionResultBySection: fetchElectionResultBySection,
  fetchElectionResult: fetchElectionResult,
  fetchByStateName: fetchByStateName,
  getDistrictSectionByTownId: getDistrictSectionByTownId,
}
