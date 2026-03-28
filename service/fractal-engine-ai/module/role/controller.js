
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
    let sessionUserId = req.session.user.id
    let skipItems = CONFIG.settings.items_by_page * (req.params.page - 1)
    let ascSort = 'DESC'
    let result = await REPOSITORY.getTotal({
      user_id: sessionUserId,
    })
    if (result.error !== null)
      throw result.error
    response.total_items = result.total
    result = await REPOSITORY.list({
      sort: ascSort,
      skip: skipItems,
      limit: CONFIG.settings.items_by_page,
      user_id: sessionUserId,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_pages = Math.ceil(response.total_items / CONFIG.settings.items_by_page)
    response.items_skipped = skipItems
    response.total_items = response.total_items
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
    let sessionUserId = req.session.user.id
    let skipItems = CONFIG.settings.items_by_page * (req.params.page - 1)
    let ascSort = 'DESC'
    let result = await REPOSITORY.getTotal({
      user_id: sessionUserId,
    })
    if (result.error !== null)
      throw result.error
    response.total_items = result.total
    result = await REPOSITORY.listAll({
      sort: ascSort,
      skip: skipItems,
      limit: CONFIG.settings.items_by_page,
      user_id: sessionUserId,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_pages = Math.ceil(response.total_items / CONFIG.settings.items_by_page)
    response.items_skipped = skipItems
    response.total_items = response.total_items
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
    let sessionUserId = req.session.user.id
    let search = req.query.s
    let limit = 10
    let roleId = parseInt(req.session.user.role_id)
    let onlyIn = `id IN (${ roleId + 1 }) AND `
    // NOTE: role ids = 1-administrator 2-national 3-coordinador estatal 4-coordinador distrital 5-coordinador municipal
    if (roleId === 1)
      onlyIn = ``
    let result = await REPOSITORY.filter({
      search: search,
      limit: limit,
      user_id: sessionUserId,
      only_id: onlyIn,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_pages = 1
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
    req.body.user_id = sessionUserId
    let result = await REPOSITORY.add(req.body)
    if (result.error !== null)
      throw result.error
    response.data = result.record
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-post`,
      data: response.data,
      notification: {
        user_id: sessionUserId,
        notification_type: 'log',
        notification_title: `new ${ req.routeOptions.config.name } added`,
        notification_description: '',
      },
    })
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
    req.body.user_id = sessionUserId
    let result = await REPOSITORY.update(req.body)
    if (result.error !== null)
      throw result.error
    response.data = result.record
    result = await REPOSITORY.findRoleResources(result.record.id)
    if (result.error !== null)
      throw result.error
    response.data.role_resources = result.records
    res.pushBroadcastMessage(0, {
      channel: 'role-resources-put',
      data: {
        id: response.data.id,
        role_resources: response.data.role_resources,
      },
    })
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-put`,
      data: response.data,
      notification: {
        user_id: sessionUserId,
        notification_type: 'log',
        notification_title: `${ req.routeOptions.config.name } updated`,
        notification_description: '',
      },
    })
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
    req.body.user_id = sessionUserId
    let result = await REPOSITORY.remove(req.body)
    if (result.error !== null)
      throw result.error
    response.data = result.record
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-delete`,
      data: response.data,
      notification: {
        user_id: sessionUserId,
        notification_type: 'log',
        notification_title: `${ req.routeOptions.config.name } deleted`,
        notification_description: '',
      },
    })
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
    let sessionUserId = req.session.user.id
    let result = await REPOSITORY.find({
      id: req.params.id,
      user_id: sessionUserId,
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
  getAll: getAll,
  search: search,
  post: post,
  put: put,
  remove: remove,
  get: get,
}
