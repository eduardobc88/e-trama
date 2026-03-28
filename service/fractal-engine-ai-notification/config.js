const APP_CONFIG = {
  port: 80,
  appName: 'FRACTAL NOTIFICATION SERVICE',
  bcryptSaltRounds: 12,
  appSecret: 'iCd5e@rz$3-93R_AZwIW2Dg-Zn^h&heD', // 32 characters
  reportDirectory: '../proxy-service/static/storage/reports/',
  sessionMaxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
  ipAddressToListen: process.env.FRACTAL_ENGINE_AI_HOST_IP, // 0.0.0.0 for docker container
  domain: process.env.FRACTAL_ENGINE_AI_DOMAIN, // localhost \ ip address \ domain.com
  development_mode: ((process.env.FRACTAL_ENGINE_AI_LOGS === '1')?true:false),
  hostURL: `${ ((process.env.FRACTAL_ENGINE_AI_LOGS === '1')?'http://www.':'https://www.') }${ process.env.FRACTAL_ENGINE_AI_DOMAIN }`,
  appLogs: ((process.env.FRACTAL_ENGINE_AI_LOGS === '0')?false:true),
  serviceConf: {
    ignoreTrailingSlash: true,
    maxParamLength: 200,
    caseSensitive: true,
    logger: ((process.env.FRACTAL_ENGINE_AI_LOGS === '0')?false:true),
    bodyLimit: 9999999,
  },
  socketIOOptions: {
    path: '/notification-service/socket-io/',
    socketIOpingTimeout: 60000,
    pingInterval: 10000,
    pingTimeout: 5000,
  },
  emailOptions: {
    emailService: process.env.FRACTAL_ENGINE_AI_EMAIL_SERVICE,
    emailAccount: process.env.FRACTAL_ENGINE_AI_EMAIL_ACCOUNT,
    emailAccountPassword: process.env.FRACTAL_ENGINE_AI_EMAIL_PASSWORD,
  },
  freeSessionIPs: [
    process.env.FRACTAL_ENGINE_AI_APP_SERVICE_IP,
  ],
  DB: {
    host: process.env.FRACTAL_ENGINE_AI_MYSQL_SERVICE_IP,
    user: process.env.FRACTAL_ENGINE_AI_MYSQL_USER,
    password: process.env.FRACTAL_ENGINE_AI_MYSQL_PASSWORD,
    db_name: process.env.FRACTAL_ENGINE_AI_MYSQL_DB_NAME,
    connectionLimit: 50,
  },
}

module.exports = APP_CONFIG
