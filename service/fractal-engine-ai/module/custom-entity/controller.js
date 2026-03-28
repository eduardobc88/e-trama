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
    let result = await REPOSITORY.add({
      record: req.body,
    })
    if (result.error !== null)
      throw result.error
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.resource_name }-post`,
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

const get = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.find({
      record: { id: req.params.id, },
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
    let result = await REPOSITORY.update({
      record: req.body,
    })
    if (result.error !== null)
      throw result.error
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.resource_name }-put`,
      data: result.record,
      notification: {
        user_id: req.session.user.id,
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
    let result = await REPOSITORY.remove({
      record: req.body,
    })
    if (result.error !== null)
      throw result.error
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.resource_name }-delete`,
      data: result.record,
      notification: {
        user_id: req.session.user.id,
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

const searchEntityFields = async (req, res) => {
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
    let customEntityId = req.params.custom_entity_id
    let limit = 10
    let result = await REPOSITORY.filterEntityFields({
      custom_entity_id: customEntityId,
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

const getByName = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let customEntityName = req.params.custom_entity_name.replaceAll('-', ' ')
    let result = await REPOSITORY.findByName({
      record: { name: customEntityName, },
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
  post: post,
  get: get,
  put: put,
  remove: remove,
  search: search,
  searchEntityFields: searchEntityFields,
  getByName: getByName,
}
