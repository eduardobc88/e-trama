
const fetchFederalDistrict = `
  SELECT
    FDF.id,
    FDF.district_id,
    FDF.header,
    FDF.name,
    FDF.geometry,
    IFNULL(FDF.color, '') AS color,
    IFNULL(FDF.description, '') AS description
  FROM
    federal_district_feature AS FDF;
`

const fetchLocalDistrict = `
  SELECT
    LDF.id,
    LDF.district_id,
    LDF.header,
    LDF.name,
    LDF.geometry,
    IFNULL(LDF.color, '') AS color,
    IFNULL(LDF.description, '') AS description
  FROM
    local_district_feature AS LDF;
`

const fetchTown = `
  SELECT
    TF.id,
    TF.town_id,
    TF.name,
    TF.geometry,
    TF.district_f_id,
    TF.district_l_id,
    IFNULL(TF.color, '') AS color,
    IFNULL(TF.description, '') AS description
  FROM
    town_feature AS TF;
`

const fetchSection = `
  SELECT
    SF.id,
    SF.section_id,
    SF.town_id,
    SF.name,
    SF.geometry,
    SF.district_f_id,
    SF.district_l_id,
    IFNULL(SF.color, '') AS color,
    IFNULL(SF.description, '') AS description
  FROM
    section_feature AS SF;
`


export default {
  fetchFederalDistrict: fetchFederalDistrict,
  fetchLocalDistrict: fetchLocalDistrict,
  fetchTown: fetchTown,
  fetchSection: fetchSection,
}
