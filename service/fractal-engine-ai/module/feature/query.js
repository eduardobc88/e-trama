
const fetchFederalDistrict = `
  SELECT
    FDF.id,
    FDF.district_id,
    FDF.name,
    FDF.geometry
  FROM
    federal_district_feature AS FDF;
`

const fetchLocalDistrict = `
  SELECT
    LDF.id,
    LDF.district_id,
    LDF.name,
    LDF.geometry
  FROM
    local_district_feature AS LDF;
`

const fetchTown = `
  SELECT
    TF.id,
    TF.town_id,
    TF.name,
    TF.geometry,
    TF.federal_district_ids,
    TF.local_district_ids
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
    SF.distrito_f_id,
    SF.distrito_L_id
  FROM
    section_feature AS SF;
`


export default {
  fetchFederalDistrict: fetchFederalDistrict,
  fetchLocalDistrict: fetchLocalDistrict,
  fetchTown: fetchTown,
  fetchSection: fetchSection,
}
