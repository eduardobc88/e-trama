import bcrypt from 'bcrypt'
import dateTime from 'node-datetime'

import SERVICE_CONFIG from '../config.js'
import sessionRepository from '../module/session/repository.js'
import permission from './permission.js'
import accountRepository from '../module/account/repository.js'


const isAuthenticated = async (req, res) => {
  if (req.session.user === undefined) {
    const urlData = req.urlData()
    if (urlData.path.indexOf('/dashboard/api/') >= 0) {
      req.session.lastPath = urlData.path
      await res.view('dashboard-login', {
        title: SERVICE_CONFIG.name,
        error_message: 'session finished',
        csrfToken: res.generateCsrf(),
        serviceStaticPath: SERVICE_CONFIG.serviceStaticPath,
      })
      return
    }
    if (urlData.path.match('/dashboard/$') !== null)
      req.session.lastPath = urlData.path
    await res.view('dashboard-login', {
      title: SERVICE_CONFIG.name,
      error_message: '',
      csrfToken: await res.generateCsrf(),
      serviceStaticPath: SERVICE_CONFIG.serviceStaticPath,
    })
    return
  }
  // NOTE: check for validation and permission errors
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: fisrtMessage.message,
    })
    return res
  }
  if (req.routeOptions.config.free === undefined || !req.routeOptions.config.free) {
    let hasPermission = await permission.canUser({
      req: req,
      res: res,
    })
    if (!hasPermission) {
      res.code(500)
      await res.send({
        status_code: 1,
        status_msg: 'you don\'t have permission',
      })
      return res
    }
  }
  if (req.session.lastPath) {
    let redirectURL = req.session.lastPath
    req.session.lastPath = ''
    await res.redirect(redirectURL)
    return
  }
}

const validateSchema = async (req, res) => {
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: fisrtMessage.message,
    })
    return res
  }
}

const saveSessionOnDB = (sessionID, user) => {
  // let session = new sessionRepository()
  // session._id = sessionID
  // session.createdAt = dateTime.create().now()
  // session.session_user = user
  // session.save()
}

const hashPassword = async (userPass) => {
  try {
    let hashedPassword = await bcrypt.hash(userPass, SERVICE_CONFIG.bcryptSaltRounds)
    return hashedPassword
  } catch (err) {
    return err
  }
}

const passwordIsEqual = (userPass, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(userPass, hashedPassword)
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const currentUserSessionDataChanged = (user, req) => {
  return new Promise((resolve, reject) => {
    let removeSession = false
    // NOTE: improve this with session collection
    if (user._id.toString() !== req.session.user.id.toString())
      resolve(false)
    else if (user.role_id.toString() !== req.session.user.role_id.toString())
      removeSession = true
    else if (user.user_name.toString() !== req.session.user.user_name.toString())
      removeSession = true
    else if (user.user_pass.toString() !== req.session.user.user_pass.toString())
      removeSession = true
    if (removeSession) {
      req.sessionStore.destroy(req.session.sessionId)
      resolve(true)
    }
    resolve(false)
  })
}

const removeUserSessionOnDB = async userId => {
  try {
    let session = await sessionRepository.remove(userId)
    if (session.error === undefined)
      return true

    return false
  } catch (err) {
    return false
  }
}

const sessionStart = async (req, res, IMSAPIKey) => {
  let result = {
    data: {},
    error: null,
    status_code: 0,
    status_msg: '',
  }
  try {
    let resData = await accountRepository.findByToken(IMSAPIKey)
    if (resData.error !== null)
      throw resData.error
    req.session.user = resData.record
  } catch (err) {
    res.code(500)
    result.error = err
    result.status_code = 1
  } finally {
    return result
  }
}

export default {
  isAuthenticated: isAuthenticated,
  hashPassword: hashPassword,
  passwordIsEqual: passwordIsEqual,
  currentUserSessionDataChanged: currentUserSessionDataChanged,
  removeUserSessionOnDB: removeUserSessionOnDB,
  saveSessionOnDB: saveSessionOnDB,
  validateSchema: validateSchema,
  sessionStart: sessionStart,
}
