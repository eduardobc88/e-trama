import SERVICE_CONFIG from '../../config.js'
import REPOSITORY from './repository.js'
import FILE_UPLOAD from '../../lib/file-upload.js'
import CUSTOM_ENTITY_RECORD_REPOSITORY from '../custom-entity-record/repository.js'


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
      area_id: req.session.user.area_id,
      user_id: req.session.user.id,
    })
    if (result.error !== null)
      throw result.error
    let total = result.total
    result = await REPOSITORY.list({
      area_id: req.session.user.area_id,
      sort: ascSort,
      skip: skipItems,
      limit: SERVICE_CONFIG.settings.items_by_page,
      user_id: req.session.user.id,
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

const get = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.find({
      area_id: req.session.user.area_id,
      id: req.params.id,
      role_id: req.session.user.role_id,
    })
    if (result.error !== null)
      throw fileGetReult.error
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
    let result = await FILE_UPLOAD.fileUpload(req, res)
    if (result.error !== null)
      throw result.error
    result = await REPOSITORY.add({
      area_id: req.session.user.area_id,
      file_name: result.file_data.file_name,
      file_title: result.file_data.file_title,
      file_description: result.file_data.file_description,
      file_mime_type: result.file_data.file_mime_type,
      file_size: result.file_data.file_size,
      gd_file_id: result.file_data.file_gd_file_id,
      user_id: req.session.user.id,
    })
    if (result.error !== null)
      throw result.error
    response.data = result.record
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
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err
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
      area_id: req.session.user.area_id,
      file_title: req.body.file_title,
      file_description: req.body.file_description,
      id: req.body.id,
      user_id: req.session.user.id,
    })
    if (result.error !== null)
      throw result.error
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-put`,
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
    response.status_msg = error.toString()
  } finally {
    await res.send(response)
    return res
  }
}

const remove = async (req, res) => {
  let result = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.remove({
      area_id: req.session.user.area_id,
      id: req.body.id,
      user_id: req.session.user.id,
    })
    if (result.error !== null)
      throw result.error
    result.data = result.record
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-delete`,
      data: result.data,
      notification: {
        user_id: req.session.user.id,
        notification_type: 'log',
        notification_title: `${ req.routeOptions.config.name }-deleted`,
        notification_description: '',
      },
    })
  } catch (err) {
    res.code(500)
    result.status_code = 1
    result.status_msg = err
  } finally {
    await res.send(result)
    return res
  }
}

const getAttachmentFile = async (req, res) => {
  let response = {
    data: '',
    status_code: 0,
    status_msg: '',
  }
  try {
    // NOTE: CHECK IF IS CURRENT AREA FILE
    let result = await REPOSITORY.find({
      area_id: req.session.user.area_id,
      id: req.params.id,
      prop_match: '',
    })
    if (result.error !== null)
      throw result.error
    if (result.record !== null)
      response.data = result.record
    else {
      // NOTE: CHECK IF IS FROM OTHER AREA
      let customEntityName = req.params.custom_entity_record_area
      customEntityName = customEntityName.replaceAll('_', '-')
      let result = await CUSTOM_ENTITY_RECORD_REPOSITORY.selectAttachments({
        id: req.params.id,
        area_id: req.session.user.area_id,
        custom_entity_name: customEntityName,
        record: {
          id: req.params.custom_entity_record_id,
        },
      })
      if (result.error !== null)
        throw result.error
      if (result.record.attachment_files.indexOf(req.params.id) === -1)
        throw result.record.attachment_files
      // NOTE: GET FILE DATA WITHOUT AREA ID
      result = await REPOSITORY.findById({
        id: req.params.id,
      })
      if (result.error !== null)
        throw result.error
      response.data = result.record
    }
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
  get: get,
  getAttachmentFile: getAttachmentFile,
  getPage: getPage,
  post: post,
  put: put,
  remove: remove,
  search: search,
}
