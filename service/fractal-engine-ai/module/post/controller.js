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
    let userId = req.session.user.id
    let roleId = parseInt(req.session.user.role_id)
    let propMatch = ''
    if (roleId > 1) // NOTE: different of admin
      propMatch = `user_id = ${ userId } AND `
    let result = await REPOSITORY.getTotal({
      prop_match: propMatch,
    })
    if (result.error !== null)
      throw result.error
    response.total_items = result.record.total
    result = await REPOSITORY.list({
      prop_match: propMatch,
      sort: ascSort,
      skip: skipItems,
      limit: SERVICE_CONFIG.settings.items_by_page,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_pages = Math.ceil(response.total_items / SERVICE_CONFIG.settings.items_by_page)
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

const search = async (req, res) => {
  let response = {
    items: [],
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let userId = req.session.user.id
    let roleId = parseInt(req.session.user.role_id)
    let propMatch = ''
    if (roleId > 1) // NOTE: different of admin
      propMatch = `user_id = ${ userId } AND `
    let search = req.query.s
    let limit = 10
    let result = await REPOSITORY.filter({
      prop_match: propMatch,
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
    let userId = req.session.user.id
    req.body.user_id = userId
    req.body.file_ids = JSON.stringify(req.body.file_ids)
    let roleId = parseInt(req.session.user.role_id)
    let propMatch = ''
    if (roleId > 1) // NOTE: different of admin
      propMatch = `user_id = ${ userId } AND `
    let result = await REPOSITORY.add({
      record: req.body,
      prop_match: propMatch,
    })
    if (result.error !== null)
      throw result.error
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-post`,
      data: result.record,
      notification: {
        user_id: req.session.user.id,
        notification_type: 'log',
        notification_title: `new ${ req.routeOptions.config.name } added`,
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

const put = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let userId = req.session.user.id
    req.body.user_id = userId
    req.body.file_ids = JSON.stringify(req.body.file_ids)
    let roleId = parseInt(req.session.user.role_id)
    let propMatch = ''
    if (roleId > 1) // NOTE: different of admin
      propMatch = `user_id = ${ userId } AND `
    let result = await REPOSITORY.update({
      record: req.body,
      prop_match: propMatch,
    })
    if (result.error !== null)
      throw result.error
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-put`,
      data: result.record,
      notification: {
        user_id: req.session.user.id,
        notification_type: 'log',
        notification_title: `new ${ req.routeOptions.config.name } updated`,
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
    let userId = req.session.user.id
    req.body.user_id = userId
    let roleId = parseInt(req.session.user.role_id)
    let propMatch = ''
    if (roleId > 1) // NOTE: different of admin
      propMatch = `user_id = ${ userId } AND `
    let result = await REPOSITORY.remove({
      record: req.body,
      prop_match: propMatch,
    })
    if (result.error !== null)
      throw result.error
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: 'post-delete',
      data: result.record,
      notification: {
        user_id: req.session.user.id,
        notification_type: 'log',
        notification_title: 'post deleted',
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
    let userId = req.session.user.id
    let roleId = parseInt(req.session.user.role_id)
    let propMatch = ''
    if (roleId > 1) // NOTE: different of admin
      propMatch = `user_id = ${ userId } AND `
    let result = await REPOSITORY.find({
      record: { id: req.params.id, },
      prop_match: propMatch,
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
  search: search,
  post: post,
  put: put,
  remove: remove,
  get: get,
}
