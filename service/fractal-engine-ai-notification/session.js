const APP_CONFIG = require('./config')

const isAuthenticated = (req, res) => {
  if (APP_CONFIG.freeSessionIPs.includes(req.hostname.toString()))
    return true

  if (req.session.user !== undefined)
    return true

  return false
}

module.exports = {
  isAuthenticated: isAuthenticated,
}
