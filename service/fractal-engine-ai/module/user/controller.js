import SERVICE_CONFIG from '../../config.js'
import SESSION from '../../lib/session.js'
import REPOSITORY from './repository.js'
import ADMINISTRATOR_REPOSITORY from './administrator-repository.js'
import SESSION_REPOSITORY from '../session/repository.js'


// NOTE: role ids = 1-administrator 2-national 3-state 4-brigade 5-delegate

const isAdmin = req => {
  return ((req.session.user.role_id === '1')?true:false)
}

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
    let admin = isAdmin(req)
    let sessionUserId = req.session.user.id
    let skipItems = SERVICE_CONFIG.settings.items_by_page * (req.params.page - 1)
    let ascSort = 'DESC'
    let result = []
    if (admin)
      result = await ADMINISTRATOR_REPOSITORY.findTotal({})
    else
      result = await REPOSITORY.findTotal({
        user_id: sessionUserId,
      })
    if (result.error !== null)
      throw result.error
    response.total_items = result.total
    if (admin)
      result = await ADMINISTRATOR_REPOSITORY.list({
        sort: ascSort,
        skip: skipItems,
        limit: SERVICE_CONFIG.settings.items_by_page,
        user_id: sessionUserId,
      })
    else
      result = await REPOSITORY.list({
        sort: ascSort,
        skip: skipItems,
        limit: SERVICE_CONFIG.settings.items_by_page,
        user_id: sessionUserId,
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
    status_code: 0,
    status_msg: '',
    total_pages: 0,
    items_skipped: 0,
    total_items: 0,
  }
  try {
    let admin = isAdmin(req)
    let sessionUserId = req.session.user.id
    let search = req.query.s
    let limit = 10
    if (admin)
      result = await ADMINISTRATOR_REPOSITORY.filter({
        search: search,
        limit: limit,
        user_id: sessionUserId,
      })
    else
      result = await REPOSITORY.filter({
        search: search,
        limit: limit,
        user_id: sessionUserId,
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
    let passHashed = await SESSION.hashPassword(req.body.user_pass)
    req.body.user_pass = passHashed
    req.body.user_id = sessionUserId
    let roleId = parseInt(req.session.user.role_id)
    if (roleId > 1)
      req.body.role_id = parseInt(req.session.user.role_id) + 1 // NOTE: static role id
    req.body.file_ids = JSON.stringify(req.body.file_ids)
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
        notification_title: `${ req.routeOptions.config.name } created`,
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
    let admin = isAdmin(req)
    let sessionUserId = req.session.user.id
    let result = {}
    if (admin)
      result = await ADMINISTRATOR_REPOSITORY.find({
        id: req.params.id,
        user_id: sessionUserId,
      })
    else
      result = await REPOSITORY.find({
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

const put = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let admin = isAdmin(req)
    let sessionUserId = req.session.user.id
    // NOTE: check if password has changed
    if (req.body.user_pass) {
      let passHashed = await SESSION.hashPassword(req.body.user_pass)
      req.body.user_pass = passHashed
    }
    let roleId = parseInt(req.session.user.role_id)
    // NOTE: role ids = 1-administrator 2-national 3-coordinador estatal 4-coordinador distrital 5-coordinador municipal
    if (roleId > 1)
      req.body.role_id = parseInt(req.session.user.role_id) + 1 // NOTE: static role id
    req.body.file_ids = JSON.stringify(req.body.file_ids)
    req.body.user_id = sessionUserId
    let result = {}
    if (admin)
      result = await ADMINISTRATOR_REPOSITORY.update(req.body)
    else
      result = await REPOSITORY.update(req.body)
    if (result.error !== null)
      throw result.error
    response.data = result.record
    // NOTE: finish SESSION for this user req.body.id
    // TODO: improve this getting the SESSION data for user updated and validate if has some changes
    if (req.body.user_pass || req.body.role_id || req.body.user_name) {
      // await SESSION_REPOSITORY.remove(req.body.id)
      // NOTE: delete SESSION data for current user
      if (req.body.id === sessionUserId)
        delete req.session.user
    }
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
    let admin = isAdmin(req)
    let sessionUserId = req.session.user.id
    if (req.body.id === sessionUserId)
      throw 'not permitted'
    req.body.user_id = sessionUserId
    let result = {}
    if (admin)
      result = await ADMINISTRATOR_REPOSITORY.remove(req.body)
    else
      result = await REPOSITORY.remove(req.body)
    if (result.error !== null)
      throw result.error
    response.data = result.record
    await SESSION_REPOSITORY.remove(req.body.id)
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

const putPassword = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let users = req.body.users
    let totalErrors = 0
    for (i in users) {
      users[i]['user_id'] = req.session.user.id
      let pass = Math.random().toString(36).substr(2, 8).toString()
      let passHashed = await SESSION.hashPassword(pass)
      users[i]['user_pass_text'] = pass
      users[i]['user_pass'] = passHashed
      users[i]['position'] = 'brigadista'
      users[i]['status'] = 'updated'
      let rec = await REPOSITORY.updatePassword(users[i])
      if (rec.error !== null) {
        users[i]['status'] = 'error'
        totalErrors++
      } else {
        users[i]['user_name'] = rec.user_name
        users[i]['user_first_name'] = rec.user_first_name
        users[i]['user_last_name'] = rec.user_last_name
      }
    }
    let total = parseInt(users.length) - parseInt(totalErrors)
    response.status_msg = `${ total } users updated`
    response.data = {
      id: 0,
      users: users,
    }
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
  get: get,
  put: put,
  remove: remove,
  putPassword: putPassword,
}
