import SERVICE_CONFIG from '../../config.js'
import REPOSITORY from './repository.js'
import EVENT_EMITTER from '../../lib/event-emitter.js'


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
    let customEntityName = req.params.custom_entity_name
    customEntityName = customEntityName.replaceAll('_', '-')
    let skipItems = SERVICE_CONFIG.settings.items_by_page * (req.params.page - 1)
    let ascSort = 'DESC'
    let result = await REPOSITORY.getTotal({
      area_id: req.session.user.area_id,
      custom_entity_name: customEntityName,
    })
    if (result.error !== null)
      throw result.error
    response.total_items = result.total
    result = await REPOSITORY.list({
      area_id: req.session.user.area_id,
      custom_entity_name: customEntityName,
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

const get = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let customEntityName = req.params.custom_entity_name
    customEntityName = customEntityName.replaceAll('_', '-')
    let result = await REPOSITORY.find({
      area_id: req.session.user.area_id,
      custom_entity_name: customEntityName,
      user_id: req.session.user.id,
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

const post = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let customEntityName = req.params.custom_entity_name
    customEntityName = customEntityName.replaceAll('_', '-')
    req.body.created_user_id = req.session.user.id
    req.body.updated_user_id = req.session.user.id
    let result = await REPOSITORY.add({
      area_id: req.session.user.area_id,
      custom_entity_name: customEntityName,
      user_id: req.session.user.id,
      record: req.body,
    })
    if (result.error !== null)
      throw result.error
    response.data = result.record
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `cer-${ customEntityName }-post`,
      data: response.data,
      notification: {
        user_id: req.session.user.id,
        notification_type: 'log',
        notification_title: `new ${ req.routeOptions.config.name } added`,
        notification_description: '',
      },
    })
    EVENT_EMITTER.emit(`cer-${ customEntityName }`, 'post', {
      custom_entity_name: customEntityName,
      record: response.data,
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
    let customEntityName = req.params.custom_entity_name
    customEntityName = customEntityName.replaceAll('_', '-')
    req.body.updated_user_id = req.session.user.id
    // NOTE: GET CURRENT RECORD
    let result = await REPOSITORY.find({
      area_id: req.session.user.area_id,
      custom_entity_name: customEntityName,
      user_id: req.session.user.id,
      record: { id: req.body.id, },
    })
    if (result.error !== null)
      throw result.error
    let oldRecord = result.record
    result = await REPOSITORY.update({
      area_id: req.session.user.area_id,
      custom_entity_name: customEntityName,
      user_id: req.session.user.id,
      record: req.body,
    })
    if (result.error !== null)
      throw result.error
    response.data = result.record
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `cer-${ customEntityName }-put`,
      data: response.data,
      notification: {
        user_id: req.session.user.id,
        notification_type: 'log',
        notification_title: `${ req.routeOptions.config.name } updated`,
        notification_description: '',
      },
    })
    EVENT_EMITTER.emit(`cer-${ customEntityName }`, 'put', {
      custom_entity_name: customEntityName,
      old_record: oldRecord,
      record: response.data,
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
    let customEntityName = req.params.custom_entity_name
    customEntityName = customEntityName.replaceAll('_', '-')
    req.body.updated_user_id = req.session.user.id
    // NOTE: GET CURRENT RECORD
    let result = await REPOSITORY.find({
      area_id: req.session.user.area_id,
      custom_entity_name: customEntityName,
      user_id: req.session.user.id,
      record: { id: req.body.id, },
    })
    if (result.error !== null)
      throw result.error
    let oldRecord = result.record
    result = await REPOSITORY.remove({
      area_id: req.session.user.area_id,
      custom_entity_name: customEntityName,
      user_id: req.session.user.id,
      record: req.body,
    })
    if (result.error !== null)
      throw result.error
    response.data = result.record
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `cer-${ customEntityName }-delete`,
      data: response.data,
      notification: {
        user_id: req.session.user.id,
        notification_type: 'log',
        notification_title: `${ req.routeOptions.config.name } deleted`,
        notification_description: '',
      },
    })
    EVENT_EMITTER.emit(`cer-${ customEntityName }`, 'delete', {
      custom_entity_name: customEntityName,
      old_record: oldRecord,
      record: response.data,
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
    let customEntityName = req.params.custom_entity_name
    customEntityName = customEntityName.replaceAll('_', '-')
    let search = req.query.s
    let limit = 10
    let result = await REPOSITORY.filter({
      area_id: req.session.user.area_id,
      search: search,
      limit: limit,
      custom_entity_name: customEntityName,
      user_id: req.session.user.id,
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

const searchRelatedRecord = async (req, res) => {
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
    let result = await REPOSITORY.filterRelatedRecord({
      area_id: req.session.user.area_id,
      search: search,
      limit: limit,
      user_id: req.session.user.id,
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

const getRelatedRecord = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let customEntityName = req.params.custom_entity_name
    customEntityName = customEntityName.replaceAll('_', '-')
    let result = await REPOSITORY.findRelatedRecord({
      area_id: req.session.user.area_id,
      custom_entity_name: customEntityName,
      user_id: req.session.user.id,
      record: { id: req.params.id, },
      related_record_id: req.params.related_record_id,
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
  post: post,
  put: put,
  remove: remove,
  search: search,
  searchRelatedRecord: searchRelatedRecord,
  getRelatedRecord: getRelatedRecord,
}
