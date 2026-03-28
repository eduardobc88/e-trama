const nodemailer = require('nodemailer')

const APP_CONFIG = require('../config')


const transporter = nodemailer.createTransport({
  service: APP_CONFIG.emailOptions.emailService,
  host: 'smtp.gmail.com',
  secureConnection: false,
  port: 587,
  auth: {
    type: 'login',
    user: APP_CONFIG.emailOptions.emailAccount,
    pass: APP_CONFIG.emailOptions.emailAccountPassword,
  },
  // tls: {
  //   ciphers:'SSLv3'
  // },
  logger: false,
  debug: false,
})

exports.sendEmail = async data => {
  try {
    let result = await transporter.sendMail({
      from: APP_CONFIG.emailOptions.emailAccount,
      to: data.to,
      subject: data.subject,
      html: data.html,
    })
    return {
      data: result,
      error: null,
    }
  } catch (err) {
    return {
      error: err,
    }
  }
}