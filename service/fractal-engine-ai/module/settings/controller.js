import SERVICE_CONFIG from '../../config.js'
import REPOSITORY from './repository.js'


const get = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.find()
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
    let result = await REPOSITORY.update(req.body)
    if (result.error !== null)
      throw result.error
    response.data = result.record
    SERVICE_CONFIG.settings = result.record
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: `${ req.routeOptions.config.name }-put`,
      data: response.data,
      notification: {
        user_id: req.session.user.id,
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

export const setSettings = async () => {
  let res = {
    error: null,
  }
  try {
    let result = await REPOSITORY.find()
    if (result.error !== null)
      throw result.error
    SERVICE_CONFIG.settings.use_google_drive = result.record.use_google_drive
    SERVICE_CONFIG.settings.gd_folder_id = result.record.gd_folder_id
    SERVICE_CONFIG.settings.gd_auth_client_email = result.record.gd_auth_client_email
    SERVICE_CONFIG.settings.gd_auth_private_key = result.record.gd_auth_private_key
    SERVICE_CONFIG.settings.items_by_page = result.record.items_by_page
  } catch (err) {
    res.error = err
  } finally {
    return res
  }
}

export default {
  get: get,
  put: put,
}
