import REPOSITORY from './repository.js'


const getElectionItems = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.listElection()
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_items = result.records.length
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    res.send(response)
    return res
  }
}

const getElectionResultItems = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let scope = req.params.scope
    let type = req.params.type
    let election = req.params.election
    let result = await REPOSITORY.listElectionResult({
      scope: scope,
      type: type,
      election: election,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_items = result.records.length
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    res.send(response)
    return res
  }
}

const getElectionResultByFederalDistrictItems = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let scope = req.params.scope
    let type = req.params.type
    let election = req.params.election
    let result = await REPOSITORY.listElectionByFederalDistrict({
      scope: scope,
      type: type,
      election: election,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_items = result.records.length
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    res.send(response)
    return res
  }
}

const getElectionResultByLocalDistrictItems = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let scope = req.params.scope
    let type = req.params.type
    let election = req.params.election
    let result = await REPOSITORY.listElectionByLocalDistrict({
      scope: scope,
      type: type,
      election: election,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_items = result.records.length
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    res.send(response)
    return res
  }
}

const getElectionResultByTownItems = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let scope = req.params.scope
    let type = req.params.type
    let election = req.params.election
    let result = await REPOSITORY.listElectionByTown({
      scope: scope,
      type: type,
      election: election,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_items = result.records.length
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    res.send(response)
    return res
  }
}

const getElectionResultBySectionItems = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let scope = req.params.scope
    let type = req.params.type
    let election = req.params.election
    let result = await REPOSITORY.listElectionBySection({
      scope: scope,
      type: type,
      election: election,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_items = result.records.length
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    res.send(response)
    return res
  }
}

const getAll = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let stateName = req.params.state
    let result = await REPOSITORY.listAll({
      state_name: stateName,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_items = result.records.length
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
  getElectionItems: getElectionItems,
  getElectionResultItems: getElectionResultItems,
  getElectionResultByFederalDistrictItems: getElectionResultByFederalDistrictItems,
  getElectionResultByLocalDistrictItems: getElectionResultByLocalDistrictItems,
  getElectionResultByTownItems: getElectionResultByTownItems,
  getElectionResultBySectionItems: getElectionResultBySectionItems,
  getAll: getAll,
}
