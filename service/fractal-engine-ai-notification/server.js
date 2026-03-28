const SERVICE_CONFIG = require('./config')

const Fastify = require('fastify')
const fastifySession = require('@fastify/session')
const fastifyCookie = require('@fastify/cookie')
const fastifyFormBody = require('@fastify/formbody')
const MySQLSessionStore = require('express-mysql-session')(fastifySession)
const fastifyCors = require('@fastify/cors')
const fastifyHelmet = require('@fastify/helmet')
const fastifyIO = require('fastify-socket.io')
const fastifyCron = require('fastify-cron')

const fastify = Fastify(SERVICE_CONFIG.serviceConf)

const MY_SQL_DB = require('./db/mysqldb')
const SocketIO = require('./socket-io')
const lib = require('./lib/lib')
const mail = require('./lib/mail')

const pushNotificationRouter = require('./module/push-notification/router')
const notificationReportCronTask = require('./module/notification-report/cron-task')


// NOTE: register socketIO
fastify.register(fastifyIO, SERVICE_CONFIG.socketIOOptions)

// body parse
fastify.register(fastifyFormBody, { bodyLimit: SERVICE_CONFIG.serviceConf.bodyLimit })

// cors
fastify.register(fastifyCors, {
  origin: SERVICE_CONFIG.domain,
})

// security headers
fastify.register(fastifyHelmet, {
  hidePoweredBy: {
    setTo: SERVICE_CONFIG.appName,
  },
})

// NOTE: db connection and session store
const connection = MY_SQL_DB.getPoolConnection()
const sessionStore = new MySQLSessionStore({
    host: SERVICE_CONFIG.DB.host,
    port: 3306,
    user: SERVICE_CONFIG.DB.user,
    password: SERVICE_CONFIG.DB.password,
    database: SERVICE_CONFIG.DB.db_name,
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
      }
    },
  },
  connection)

fastify.register(fastifyCookie, {
  secret: SERVICE_CONFIG.appSecret,
  parseOptions: {},
})


fastify.register(fastifySession, {
  secret: SERVICE_CONFIG.appSecret,
  cookie: {
    maxAge: SERVICE_CONFIG.sessionMaxAge,
    expires: SERVICE_CONFIG.sessionMaxAge,
    domain: SERVICE_CONFIG.domain,
    secure: false,
  },
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
})

fastify.register(pushNotificationRouter)

// NOTE: CRON

fastify.register(fastifyCron, {
  jobs: [
    {
      name: 'cron-test',
      cronTime: '15 10 * * *',
      onTick: async () => {
        let currentDate = new Date()
        let currentDateFormated = lib.formatDate(currentDate)
        sendMailStartServer('ALL WORKING!')
      },
    }
  ]
})

const sendMailStartServer = message => {
  let currentDate = new Date()
  let currentDateFormated = lib.formatDate(currentDate)
  mail.sendEmail({
    to: 'eduardobc.88@gmail.com',
    subject: `FRACTAL EMAIL - ${ currentDateFormated }`,
    html: `${ message } - ${ currentDateFormated }`,
  })
}


// listener


const FASTIFY_LISTEN_OPTIONS = {
  port: SERVICE_CONFIG.port,
  host: SERVICE_CONFIG.ipAddressToListen,
}
fastify.listen(FASTIFY_LISTEN_OPTIONS, (err, address) => {
  console.log(`== APP SERVICE LISTENING : ${ address } ==`)
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`== ${ SERVICE_CONFIG.appName } listening on ${ SERVICE_CONFIG.ipAddressToListen } ==`)
  // NOTE: CRON TASKS
  if (!SERVICE_CONFIG.development_mode) {
    for (let key in notificationReportCronTask)
      fastify.cron.createJob(notificationReportCronTask[key])
    fastify.cron.startAllJobs()
    sendMailStartServer('SERVER STARTED')
  }
})


const socketIO = new SocketIO()
fastify.decorateReply('pushBroadcastMessage', payload => {
  socketIO.pushBroadcastMessage(payload)
})
fastify.decorateReply('pushMessageToSessionIds', payload => {
  socketIO.pushMessageToSessionIds(payload)
})
fastify.ready().then(() => {
  socketIO.init(SERVICE_CONFIG.serviceConf.logger, fastify.io, fastify)
})
