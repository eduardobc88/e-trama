import SERVICE_CONFIG from './config.js'

import EJS from 'ejs'
import PATH from 'path'
import FASTIFY from 'fastify'
import FASTIFY_FORM_BODY from '@fastify/formbody'
import FASTIFY_SESSION from '@fastify/session'
import FASTIFY_COOKIE from '@fastify/cookie'
import MY_SQL_SESSION_STORE from 'express-mysql-session'
import FASTIFY_CORS from '@fastify/cors'
import FASTIFY_MULTIPART from '@fastify/multipart'
import FASTIFY_URL_DATA from '@fastify/url-data'
import FASTIFY_HELMET from '@fastify/helmet'
import FASTIFY_VIEW from '@fastify/view'
import FASTIFY_CSRF from '@fastify/csrf-protection'
import FASTIFY_REPLY_FROM from '@fastify/reply-from'

const FASTIFY_INSTANCE = FASTIFY(SERVICE_CONFIG.serviceConf)
const MY_SQL_SESSION_STORE_INSTANCE = MY_SQL_SESSION_STORE(FASTIFY_SESSION)


// NOTE: LOCAL VENDORS
import JWT from './jwt.js'
import LIB_MY_SQL_DB from './lib/mysqldb.js'
import LIB_SESSION from './lib/session.js'
import LIB_PUSH_NOTIFICATION from './lib/push-notification.js'


// NOTE: NATIVE MODULES
import MODULE_AREA from './module/area/index.js'
import MODULE_CATEGORY from './module/category/index.js'
import MODULE_CUSTOM_ENTITY_RECORD from './module/custom-entity-record/index.js'
import MODULE_CUSTOM_ENTITY from './module/custom-entity/index.js'
import MODULE_CUSTOM_FIELD from './module/custom-field/index.js'
import MODULE_CUSTOM_LIST from './module/custom-list/index.js'
import MODULE_FEEDBACK from './module/feedback/index.js'
import MODULE_FILE from './module/file/index.js'
import MODULE_LANGUAGE from './module/language/index.js'
import MODULE_NOTIFICATION from './module/notification/index.js'
import MODULE_POST from './module/post/index.js'
import MODULE_PROFILE from './module/profile/index.js'
import MODULE_RESOURCE from './module/resource/index.js'
import MODULE_ROLE from './module/role/index.js'
import MODULE_SEARCH from './module/search/index.js'
import MODULE_SESSION from './module/session/index.js'
import MODULE_SETTINGS from './module/settings/index.js'
import MODULE_USER from './module/user/index.js'
import MODULE_WEBSITE from './module/website/index.js'
import MODULE_RESULT from './module/result/index.js'
import MODULE_CANDIDATE from './module/candidate/index.js'


// NOTE: SET CONFIGURATIONS
let cacheControlValue = 'public, max-age=300'
if (SERVICE_CONFIG.serviceConf.logger)
  cacheControlValue = 'no-cache'

FASTIFY_INSTANCE.register(FASTIFY_COOKIE, {
  secret: SERVICE_CONFIG.appSecret,
  parseOptions: {},
})

FASTIFY_INSTANCE.register(FASTIFY_FORM_BODY, {
  bodyLimit: SERVICE_CONFIG.serviceConf.bodyLimit,
})

FASTIFY_INSTANCE.register(FASTIFY_CORS, {
  origin: SERVICE_CONFIG.domain,
})

FASTIFY_INSTANCE.register(FASTIFY_REPLY_FROM, {
  base: `http://${ SERVICE_CONFIG.domain }`,
  http: {
    agentOptions: { // pass in any options from https://nodejs.org/api/http.html#http_new_agent_options
      keepAliveMsecs: 120000,
    },
    requestOptions: { // pass in any options from https://nodejs.org/api/http.html#http_http_request_options_callback
      timeout: 120000, // timeout in msecs, defaults to 10000 (10 seconds)
    },
  },
})

FASTIFY_INSTANCE.register(FASTIFY_HELMET, {
  global: true,
  enableCSPNonces: true,
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'", "'unsafe-inline'"],
      'connect-src': ["*", "'unsafe-inline'", `blob:`, `ws://${SERVICE_CONFIG.domain}`],
      'frame-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", "'unsafe-inline'", "*", "data:", "blob:", "https://avatars.githubusercontent.com"],
      'manifest-src': ["'self'", "'unsafe-inline'"],
      'media-src': ["'self'", "'unsafe-inline'"],
      'object-src': ["'self'", "'unsafe-inline'"],
      'script-src': ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "'unsafe-eval'", SERVICE_CONFIG.domain, "https://cdn.socket.io", "https://maps.googleapis.com"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://maps.googleapis.com", "https://avatars.githubusercontent.com"],
      'worker-src': ["'self'", "'unsafe-inline'", "blob:"],
      'style-src-attr': ["'self'", "'unsafe-inline'"],
      'script-src-elem': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.socket.io", "https://maps.googleapis.com"],
      'style-src-elem': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.socket.io", "https://maps.googleapis.com"],
      'font-src': ["'self'", "'unsafe-inline'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
      'script-src-attr': ["'self'", "'unsafe-inline'", "https://maps.googleapis.com"],
    },
  },
})

FASTIFY_INSTANCE.register(FASTIFY_CSRF, {
  cookie: {
    path: '/',
    domain: SERVICE_CONFIG.domain,
  },
})

FASTIFY_INSTANCE.register(FASTIFY_VIEW, {
  engine: {
    ejs: EJS,
  },
  options: {
    filename: PATH.resolve('fractal/view'),
  },
  templates: 'view',
  includeViewExtension: true,
})

FASTIFY_INSTANCE.register(FASTIFY_MULTIPART)

FASTIFY_INSTANCE.register(FASTIFY_URL_DATA)

const connection = LIB_MY_SQL_DB.getPoolConnection()
const sessionStore = new MY_SQL_SESSION_STORE_INSTANCE({
  host: SERVICE_CONFIG.db.host,
  port: 3306,
  user: SERVICE_CONFIG.db.user,
  password: SERVICE_CONFIG.db.password,
  database: SERVICE_CONFIG.db.db_name,
  createDatabaseTable: true,
  connectionLimit: 1,
  expiration: 86400000,
  checkExpirationInterval: 900000,
  clearExpired: true,
  endConnectionOnClose: true,
  charset: 'utf8mb4_bin',
  schema: {
    tableName: 'session',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data',
    },
  },
},
connection)

FASTIFY_INSTANCE.register(FASTIFY_SESSION, {
  secret: SERVICE_CONFIG.appSecret,
  cookie: {
    maxAge: SERVICE_CONFIG.sessionMaxAge,
    expires: SERVICE_CONFIG.sessionMaxAge,
    domain: SERVICE_CONFIG.domain,
    secure: false,
  },
  store: sessionStore,
  resave: true,
  saveUninitialized: false,
})


// NOTE: REGISTER MODULES
FASTIFY_INSTANCE.register(MODULE_SETTINGS, { setSettings: true })
FASTIFY_INSTANCE.register(MODULE_AREA)
FASTIFY_INSTANCE.register(MODULE_CATEGORY)
FASTIFY_INSTANCE.register(MODULE_CUSTOM_ENTITY)
FASTIFY_INSTANCE.register(MODULE_CUSTOM_ENTITY_RECORD)
FASTIFY_INSTANCE.register(MODULE_CUSTOM_FIELD)
FASTIFY_INSTANCE.register(MODULE_CUSTOM_LIST)
FASTIFY_INSTANCE.register(MODULE_FEEDBACK)
FASTIFY_INSTANCE.register(MODULE_FILE)
FASTIFY_INSTANCE.register(MODULE_LANGUAGE)
FASTIFY_INSTANCE.register(MODULE_NOTIFICATION)
FASTIFY_INSTANCE.register(MODULE_POST)
FASTIFY_INSTANCE.register(MODULE_PROFILE)
FASTIFY_INSTANCE.register(MODULE_RESOURCE)
FASTIFY_INSTANCE.register(MODULE_ROLE)
FASTIFY_INSTANCE.register(MODULE_SEARCH)
FASTIFY_INSTANCE.register(MODULE_SESSION)
FASTIFY_INSTANCE.register(MODULE_USER)
FASTIFY_INSTANCE.register(MODULE_WEBSITE)
FASTIFY_INSTANCE.register(MODULE_RESULT)
FASTIFY_INSTANCE.register(MODULE_CANDIDATE)


// NOTE: INIT CUSTOM MODULES
JWT(FASTIFY_INSTANCE)

// NOTE: SET DECORATIONS
FASTIFY_INSTANCE.decorateReply('pushBroadcastMessage', (areaId = 0, data) => {
  if (areaId !== 0) {
    data.channel = `${ areaId }-${ data.channel }`
    data.notification.area_id = areaId
  }
  LIB_PUSH_NOTIFICATION.pushNotification(data)
})

// NOTE: SET SERVICE HOOKS
FASTIFY_INSTANCE.addHook('onRequest', async (req, reply) => {
  try {
    let deviceType = req.headers['device-type']
    if (deviceType === 'android') {
      // NOTE: VALIDATE URL FOR JWT AND SAVE ACCOUNT DATA IN SESSION
      let resMatch = req.urlData().PATH.match('\/jwt\/generate-token/')
      if (resMatch === null) {
        let jwtData = await req.jwtVerify()
        let isValidSession = await LIB_SESSION.sessionStart(req, reply, jwtData.token)
        if (isValidSession.error !== null)
          throw isValidSession.error
      }
    }
  } catch (err) {
    reply.send(err)
  }
})

FASTIFY_INSTANCE.addHook('preHandler', async (req, res) => {
  //res.raw.setHeader('Cache-Control', cacheControlValue)
  res.raw.setHeader('Service-Worker-Allowed', '/')
  // NOTE: improve this
  let urlData = req.urlData()
  let staticFileRegex = '/storage/[a-z0-9]+/'
  let resStorageMatch = urlData.path.match(staticFileRegex)
  if (resStorageMatch !== null) {
    await LIB_SESSION.isAuthenticated(req, res)
    if (req.session.user === undefined)
      await res.view(`${ req.session.dashboard }/dashboard-login`, {
        title: SERVICE_CONFIG.name,
        error_message: 'permission denied',
        generateCsrf: await res.generateCsrf(),
        host_url: SERVICE_CONFIG.hostURL,
      })
    else
      await res.code(404).view('404', {
        title: 'fractal',
        status: 'resource not found' + urlData.path.toString(),
        error_message: `route: ${ urlData.path } not found.`,
      })
  }
})

FASTIFY_INSTANCE.addHook('onSend', async (request, reply, payload) => {
  reply.raw.setHeader('Server', SERVICE_CONFIG.name)
  reply.raw.setHeader('X-Powered-By', `${ SERVICE_CONFIG.name } 1.0.0`)
  reply.setCookie('csrf-token', await reply.generateCsrf(), {
    path: '/',
    domain: SERVICE_CONFIG.domain,
    signed: true,
  })
  if (request.session !== null && request.session.user !== undefined) {
    reply.setCookie('user_id', request.session.user.user_id, {
      path: '/',
      domain: SERVICE_CONFIG.domain,
      signed: true,
    })
    reply.setCookie('ps-key', request.session.user.ps_key, {
      path: '/',
      domain: SERVICE_CONFIG.domain,
      signed: true,
    })
  }
  return payload
})


// NOTE: SET SERVICE ERROR AND NOT FOUND GLOBAL HANDLERS
FASTIFY_INSTANCE.setErrorHandler(async (err, req, res) => {
  req.log.warn(err)
  let statusCode = err.statusCode >= 400 ? err.statusCode : 500
  await res.code(statusCode).view('500', {
    title: SERVICE_CONFIG.name,
    status: 'server error!',
    error_message: statusCode >= 500 ? 'internal server error' : err.message,
  })
  return res
})

FASTIFY_INSTANCE.setNotFoundHandler(async (req, res) => {
  const urlData = req.urlData()
  await res.code(404).view('404', {
    title: SERVICE_CONFIG.name,
    status: 'page not found',
    error_message: `route: ${ urlData.path } not found.`,
  })
  return res
})


// NOTE: SERVER LISTENER

const start = async () => {
  const FASTIFY_LISTEN_OPTIONS = {
    port: SERVICE_CONFIG.port,
    host: SERVICE_CONFIG.ipAddressToListen,
  }
  try {
    await FASTIFY_INSTANCE.listen(FASTIFY_LISTEN_OPTIONS)
  } catch (err) {
    FASTIFY_INSTANCE.log.error(err)
    process.exit(1)
  }
}

start()
