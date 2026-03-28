
import SERVICE_CONFIG from '../../config.js'
import REPOSITORY from './repository.js'


const getPage = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let skipItems = SERVICE_CONFIG.settings.items_by_page * (req.params.page - 1)
    let ascSort = 'DESC'
    let result = await REPOSITORY.getTotal({
      user_id: req.session.user.id,
      area_id: req.session.user.area_id,
    })
    if (result.error !== null)
      throw result.error
    response.total_items = result.total
    result = await REPOSITORY.list({
      user_id: req.session.user.id,
      sort: ascSort,
      skip: skipItems,
      limit: SERVICE_CONFIG.settings.items_by_page,
      area_id: req.session.user.area_id,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_pages = Math.ceil(response.total_items /SERVICE_CONFIG.settings.items_by_page)
    response.items_skipped = skipItems
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    await res.send(response)
    return res
  }
}

const get = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.find({
      user_id: req.session.user.id,
      id: req.params.id,
      area_id: req.session.user.area_id,
    })
    if (result.error !== null)
      throw result.error
    response.data = result.record
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err.toString()
  } finally {
    await res.send(response)
    return res
  }
}


export default {
  getPage: getPage,
  get: get,
}
