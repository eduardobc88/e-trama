import SERVICE_CONFIG from '../../config.js'
import REPOSITORY from './repository.js'


const getFederalDistrictItems = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.listFederalDistrict()
    if (result.error !== null)
      throw result.error
    response.items = result.records
    //geometryToJSON(response.items)
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    res.send(response)
    return res
  }
}

const geometryToJSON = async items => {
  try {
    for (let i of items)
      console.log(i.geometry)
  } catch (err) {
    console.error('== geometryToJSON ==', err)
  } finally {
  }
}


const getLocalDistrictItems = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.listLocalDistrict()
    if (result.error !== null)
      throw result.error
    response.items = result.records
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    res.send(response)
    return res
  }
}

const getTownItems = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.listTown()
    if (result.error !== null)
      throw result.error
    response.items = result.records
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    res.send(response)
    return res
  }
}

const getSectionItems = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.listSection()
    if (result.error !== null)
      throw result.error
    response.items = result.records
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    res.send(response)
    return res
  }
}



export default {
  getFederalDistrictItems: getFederalDistrictItems,
  getLocalDistrictItems: getLocalDistrictItems,
  getTownItems: getTownItems,
  getSectionItems: getSectionItems,
}
