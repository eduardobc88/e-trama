
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
    let result = await REPOSITORY.getTotal()
    if (result.error !== null)
      throw result.error
    let total = result.total
    result = await REPOSITORY.list({
      sort: ascSort,
      skip: skipItems,
      limit: SERVICE_CONFIG.settings.items_by_page,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_pages = Math.ceil(total / SERVICE_CONFIG.settings.items_by_page)
    response.items_skipped = skipItems
    response.total_items = total
  } catch (err) {
    res.code(500)
    response.error = err.toString()
  }
  finally {
    await res.send(response)
    return response
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
    let search = req.query.s
    let limit = 10
    let result = await REPOSITORY.filter({
      search: search,
      limit: limit,
    })
    if (result.error !== null)
      throw result.error
    response.items = result.records
    response.total_pages = 0
    response.items_skipped = 0
    response.total_items = result.records.length
  } catch (err) {
    res.code(500)
    response.error = err.toString()
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
    req.body.user_id = req.session.user.id
    let result = await REPOSITORY.add(req.body)
    if (result.error !== null)
      throw result.error
    response.data = result.record
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-post`,
      data: response.data,
      notification: {
        user_id: req.session.user.id,
        notification_type: 'log',
        notification_title: `new ${ req.routeOptions.config.name } added`,
        notification_description: '',
      },
    })
  } catch (err) {
    res.code(500)
    response.error = err.toString()
  } finally {
    await res.send(response)
    return response
  }
}

const put = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    req.body.user_id = req.session.user.id
    let result = await REPOSITORY.update(req.body)
    if (result.error !== null)
      throw result.error
    response.data = result.record
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-put`,
      data: response.data,
      notification: {
        user_id: req.session.user.id,
        notification_type: 'log',
        notification_title: `new ${ req.routeOptions.config.name } updated`,
        notification_description: '',
      },
    })
  } catch (err) {
    res.code(500)
    response.error = err.toString()
  } finally {
    await res.send(response)
    return response
  }
}

const remove = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: ''
  }
  try {
    let result = await REPOSITORY.remove(req.body)
    if (result.error !== null)
      throw result.error
    response.data = result.record
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-delete`,
      data: response.data,
      notification: {
        user_id: req.session.user.id,
        notification_type: 'log',
        notification_title: `${ req.routeOptions.config.name } deleted`,
        notification_description: '',
      },
    })
  } catch (err) {
    res.code(500)
    response.error = err.toString()
  } finally {
    await res.send(response)
    return response
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
    response.error = err.toString()
  } finally {
    await res.send(response)
    return response
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
