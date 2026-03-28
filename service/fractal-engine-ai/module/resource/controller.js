
import CONFIG from '../../config.js'
import REPOSITORY from './repository.js'


const getPage = async (req, res) => {
  let response = {
    items: [],
    status_code: 0,
    status_msg: '',
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
  }
  try {
    let skipItems = CONFIG.settings.items_by_page * (req.params.page - 1)
    let ascSort = 'DESC'
    let result = await REPOSITORY.getTotal()
    if (result.error !== null)
      throw result.error
    response.total_items = result.total
    result = await REPOSITORY.list({
      sort: ascSort,
      skip: skipItems,
      limit: CONFIG.settings.items_by_page,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_pages = Math.ceil(response.total_items / CONFIG.settings.items_by_page)
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

const getAll = async (req, res) => {
  let response = {
    items: [],
    status_code: 0,
    status_msg: '',
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
  }
  try {
    let sessionUserRoleId = req.session.user.role_id
    const administratorRoleId = 1
    let result = {}
    if (sessionUserRoleId == administratorRoleId)
      result = await REPOSITORY.listAllAdmin()
    else
      result = await REPOSITORY.listAll({
        role_id: sessionUserRoleId,
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
    await res.send(response)
    return res
  }
}

const search = async (req, res) => {
  let response = {
    items: [],
    status_code: 0,
    status_msg: '',
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
  }
  try {
    let search = req.query.s
    let limit = 10
    let result = await REPOSITORY.filter({
      search: search,
      limit: limit,
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
    await res.send(response)
    return res
  }
}

const post = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let sessionUserId = req.session.user.id
    let result = await REPOSITORY.add(req.body)
    if (result.error !== null)
      throw result.error
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-post`,
      data: result.record,
      notification: {
        user_id: sessionUserId,
        notification_type: 'log',
        notification_title: `new ${ req.routeOptions.config.name } created`,
        notification_description: '',
      },
    })
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

const get = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.find(req.params.id)
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

const put = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let sessionUserId = req.session.user.id
    let result = await REPOSITORY.update(req.body)
    if (result.error !== null)
      throw result.error
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-put`,
      data: result.record,
      notification: {
        user_id: sessionUserId,
        notification_type: 'log',
        notification_title: `${ req.routeOptions.config.name } updated`,
        notification_description: '',
      },
    })
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

const remove = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let sessionUserId = req.session.user.id
    let result = await REPOSITORY.remove(req.body)
    if (result.error !== null)
      throw result.error
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-delete`,
      data: result.record,
      notification: {
        user_id: sessionUserId,
        notification_type: 'log',
        notification_title: `${ req.routeOptions.config.name } deleted`,
        notification_description: '',
      },
    })
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
  getAll: getAll,
  search: search,
  post: post,
  get: get,
  put: put,
  remove: remove,
}
