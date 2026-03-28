import SESSION from '../../lib/session.js'
import WEBSITE_REPOSITORY from '../website/repository.js'
import USER_REPOSITORY from '../user/repository.js'
import REPOSITORY from './repository.js'
import QUERY from '../../lib/query.js'


const login = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    const user_name = req.body.user_name
    const user_pass = req.body.user_pass
    let result = await USER_REPOSITORY.findByUserName(user_name)
    if (result.error !== null)
      throw 'invalid user'
    response.data = result.record
    if (!response.data.user_active)
      throw 'user not activated'
    result = await SESSION.passwordIsEqual(user_pass, response.data.user_pass)
    if (!result)
      throw 'invalid password'
    result = await WEBSITE_REPOSITORY.findRole({
      id: response.data.role_id,
    })
    if (result.error !== null)
      throw 'error retreiving user role'
    let userRoleRec = result.record
    if (!Object.keys(userRoleRec).length)
      throw 'error loading user role'
    result = await WEBSITE_REPOSITORY.findArea({
      id: response.data.area_id,
    })
    let areaRecord = result.record
    await REPOSITORY.remove(response.data.id, req.session.sessionId)
    let psKey = await QUERY.getNotificationString(response.data.id, userRoleRec.id)
    req.session.user = {
      id: response.data.id.toString(),
      area_id: response.data.area_id,
      user_id: response.data.user_id.toString(),
      user_name: response.data.user_name.toString(),
      role_id: userRoleRec.id.toString(),
      user_role_name: userRoleRec.role_name.toString(),
      user_status: 'offline',
      state_id: response.data.state_id,
      district_id: response.data.district_id,
      town_id: response.data.town_id,
      general: response.data.general,
      advicer: response.data.advicer,
      ps_key: psKey,
      gd_folder_id: areaRecord.gd_folder_id,
      area_name: areaRecord.name,
    }
    res.setCookie('ps_key', psKey)
    res.pushBroadcastMessage(req.session.user.area_id, {
      channel: 'session',
      data: response.data,
      notification: {
        user_id: response.data.id,
        notification_type: 'log',
        notification_title: 'session started',
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

const logout = async (req, res) => {
  let response = {
    id: 0,
    status: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let userId = parseInt(req.session.user.id)
    if (req.session && req.session.user) {
      let sessionId = req.session.sessionId
      await REPOSITORY.updateUserStatus(sessionId, 'offline')
      await REPOSITORY.remove(req.session.user.id, '')
      response.id = userId
      response.status = 1
      res.pushBroadcastMessage(userId, {
        channel: 'session-put',
        data: response,
        notification: {
          user_id: userId,
          notification_type: 'log',
          notification_title: 'session ended',
          notification_description: '',
        },
      })
      // NOTE: WAIT 100 MS FOR SEND BROADCAST NOTIFICATION AND GET SESSION ID ON NOTIFICATION SERVER BEFORE DESTROY SESSION
      await setTimeout(async () => {
        req.sessionStore.destroy(sessionId)
        req.session = null
      }, 50)
    }
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err
  } finally {
    await res.send(response)
    return res
  }
}

const logoutAll = async (req, res) => {
  let response = {
    id: 0,
    status: 0,
    status_code: 0,
    status_msg: '',
  }
  try {
    let userId = parseInt(req.session.user.id)
    if (req.session && req.session.user) {
      let sessionId = req.session.sessionId
      await REPOSITORY.removeAllSessions(req.session.user.id, '')
      response.id = userId
      response.status = 1
      res.pushBroadcastMessage(userId, {
        channel: 'session-put',
        data: response,
        notification: {
          user_id: userId,
          notification_type: 'log',
          notification_title: 'session ended',
          notification_description: '',
        },
      })
    }
  } catch (err) {
    res.code(500)
    response.status_code = 1
    response.status_msg = err
  } finally {
    await res.send(response)
    return res
  }
}


export default {
  login: login,
  logout: logout,
  logoutAll: logoutAll,
}
