import dateTime from 'node-datetime'
import crypto from 'crypto'

import SERVICE_CONFIG from '../../config.js'
import SESSION from '../../lib/session.js'
import USER_REPOSITORY from '../user/repository.js'


const getDashboard = async (req, res) => {
  await res.view('dashboard-index', {
    title: SERVICE_CONFIG.name,
    serviceStaticPath: SERVICE_CONFIG.serviceStaticPath,
  })
}

const getRecoverAccount = async (req, res) => {
  await res.view('recover-account', {
    title: 'recover account',
    error_message: req.query.error_message,
    success_message: req.query.success_message,
    csrfToken: res.generateCsrf(),
    serviceStaticPath: SERVICE_CONFIG.serviceStaticPath,
  })
  return res
}

const postRecoverAccount = async (req, res) => {
  if (!req.body.email_address) {
    let errorMessage = 'Enter a email'
    res.redirect(`${ req.session.dashboard }/recover-account/?error_message=${ errorMessage }`)
    return res
  }
  let user = await USER_REPOSITORY.findByEmail({
    user_email: req.body.email_address,
  })
  if (!Object.keys(user).length) {
    let errorMessage = 'Not email address found'
    res.redirect(`/recover-account/?error_message=${ errorMessage }`)
    return res
  }
  crypto.pseudoRandomBytes(16, async (err, raw) => {
    let appURL = 'localhost'
    if (err) {
      let errorMessage = 'try Again'
      res.redirect(`/recover-account/?error_message=${ errorMessage }`)
      return res
    }
    let emailSubject = SERVICE_CONFIG.name
    let hexString = `${ raw.toString('hex') }${ dateTime.create().format('YmdHMS') }`
    let emailURL = `${ appURL }/reset-password/${ hexString }`
    let userUpdate = await USER_REPOSITORY.updateToken({
      user_id: user.id,
      user_token: hexString,
    })
    if (userUpdate.error !== undefined) {
      let errorMessage = 'Try Again'
      res.redirect(`/recover-account/?error_message=${ errorMessage }`)
      return res
    }
    let emailHTMLMessage = `<h1>Hi ${ user.user_first_name }!</h1><br />`
    emailHTMLMessage += 'You requested the reset password of your account<br />'
    emailHTMLMessage += 'You can reset your password using the next URL in the same browser where you requested the reset password<br />'
    emailHTMLMessage += `${ emailURL }<br />`
    emailHTMLMessage += `<br />Thank you for use ${ SERVICE_CONFIG.name } :)<br />`
    // mail.sendEmail({
    //   from: SERVICE_CONFIG.support_email,
    //   to: user.user_email,
    //   subject: emailSubject,
    //   html: emailHTMLMessage,
    // })
    console.log('== emailHTMLMessage ==', emailURL)
    let successMessage = `We sent a email to: ${ user.user_email }`
    return res.redirect(`/recover-account/?success_message=${ successMessage }`)
  })
  return res
}

const getResetPassword = async (req, res) => {
  if (!req.params.token.length) {
    const urlData = req.urlData()
    await res.code(404).view('404', {
      title: SERVICE_CONFIG.name,
      status: 'Page not found',
      error_message: `Router: ${ urlData.path } Not found.`,
    })
    return res
  }
  let isValid = await USER_REPOSITORY.isValidToken({
    token: req.params.token,
  })
  if (!isValid) {
    const urlData = req.urlData()
    await res.code(404).view('404', {
      title: SERVICE_CONFIG.name,
      status: 'Page not found',
      error_message: `Router: ${ urlData.path } Not found.`,
    })
    return res
  }
  await res.view(`reset-password`, {
    title: 'Reset Password',
    error_message: '',
    success_message: '',
    csrfToken: res.generateCsrf(),
    host_url: SERVICE_CONFIG.hostURL,
    token: req.params.token,
  })
  return res
}

const postResetPassword = async (req, res) => {
  let isValid = await USER_REPOSITORY.isValidToken({
    token: req.body.token,
  })
  if (!isValid) {
    const urlData = req.urlData()
    await res.code(404).view('404', {
      title: SERVICE_CONFIG.name,
      status: 'Page not found',
      error_message: `Router: ${ urlData.path } Not found.`,
    })
    return res
  }
  if (!req.body.new_password) {
    await res.view('reset-password', {
      title: 'Reset Password',
      error_message: 'Fill password field',
      success_message: '',
      csrfToken: res.generateCsrf(),
      token: req.body.token,
    })
    return res
  }
  let newPassword = await SESSION.hashPassword(req.body.new_password)
  let userUpdated = await USER_REPOSITORY.updatePasswordByToken({
    user_token: req.body.token,
    user_pass: newPassword,
  })
  if (userUpdated.error !== undefined) {
    const urlData = req.urlData()
    await res.code(500).view('500', {
      title: SERVICE_CONFIG.name,
      status: 'Error',
      error_message: `Error updating user password.`,
    })
    return res
  }
  let emailSubject = SERVICE_CONFIG.name
  let emailHTMLMessage = `<h1>Hi ${ userUpdated.user_first_name }!</h1><br />`
  emailHTMLMessage += 'Your password has been changed<br />'
  emailHTMLMessage += `<br />Thank you for use ${ SERVICE_CONFIG.name } :)<br />`
  // mail.sendEmail({
  //   from: SERVICE_CONFIG.support_email,
  //   to: userUpdated.user_email,
  //   subject: emailSubject,
  //   html: emailHTMLMessage,
  // })
  console.log('== emailHTMLMessage ==', emailHTMLMessage)
  return res.redirect('/')
}


export default {
  getDashboard: getDashboard,
  getRecoverAccount: getRecoverAccount,
  postRecoverAccount: postRecoverAccount,
  getResetPassword: getResetPassword,
  postResetPassword: postResetPassword,
}
