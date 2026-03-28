import REPOSITORY from './repository.js'


const get = async (req, res) => {
  let response = {
    data: {},
    status_code: 0,
    status_msg: '',
  }
  try {
    let result = await REPOSITORY.find(req.session.user.id)
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
    let sessionRoleId = req.session.user.role_id
    let sessionUserName = req.session.user.user_name
    req.body.file_ids = JSON.stringify(req.body.file_ids)
    req.body.id = sessionUserId
    if (req.body.user_pass) {
      let passHashed = await session.hashPassword(req.body.user_pass)
      req.body.user_pass = passHashed
    }
    let result = await REPOSITORY.update(req.body)
    if (req.body.user_pass.length || req.body.user_name !== sessionUserName || req.body.role_id != sessionRoleId) {
      await sessionRepository.remove(req.body.id)
      delete req.session.user
    }
    if (result.error !== null)
      throw result.error
    response.data = result.record
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


export default {
  get: get,
  put: put,
}
