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
  getAll: getAll,
}
