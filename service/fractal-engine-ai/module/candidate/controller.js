import REPOSITORY from './repository.js'


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
    let result = {}
    let reqParamCandidateType = req.params.candidate_type
    // NOTE: type = regidor, presidente, sindico, diputado
    if (reqParamCandidateType === 'regidor')
      result = await REPOSITORY.listCouncilor()
    else if (reqParamCandidateType === 'base')
      result = await REPOSITORY.fetchBase()
    else
      result = await REPOSITORY.fetchCandidate({
        tipo: reqParamCandidateType,
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
  getAll: getAll,
}
