export default {
  name: 'fractal',
  records_peer_page: 100,
  port: 80,
  bcryptSaltRounds: 12,
  appSecret: 'iEBCe@rx$3-9rR_QZwIW2Dg-Zn^h&heS', // 32 characters
  serviceStaticPath: '/static/dashboard/fractal-engine-ai/',
  staticUploadPath: 'site-static',
  staticUploadPrefix: 'storage',
  uploadDirectory: '../upload/',
  reportDirectory: '../upload/reports/',
  staticFilesPath: 'fractal-engine-ai-static',
  staticFilesPrefix: 'static',
  sessionMaxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
  ipAddressToListen: process.env.FRACTAL_ENGINE_AI_HOST_IP, // 0.0.0.0 for docker container
  domain: process.env.FRACTAL_ENGINE_AI_DOMAIN, // localhost \ ip address \ domain.com
  hostURL: `${ ((process.env.FRACTAL_ENGINE_AI_LOGS === '1')?'http://www.':'https://www.') }${ process.env.FRACTAL_ENGINE_AI_DOMAIN }`,
  appLogs: ((process.env.FRACTAL_ENGINE_AI_LOGS === '0')?false:true),
  gdAccountFolderId: "",
  gdAccountFolderGeneralId: "",
  gdAccountClientEmail: "",
  gdAccountPrivateKey: "",
  serviceConf: {
    http2: false,
    https: null,
    ignoreTrailingSlash: true,
    logger: ((process.env.FRACTAL_ENGINE_AI_LOGS === '0')?false:true),
    bodyLimit: 50485760, // 50MB
  },
  db: {
    host: process.env.FRACTAL_ENGINE_AI_MYSQL_SERVICE_IP,
    user: process.env.FRACTAL_ENGINE_AI_MYSQL_USER,
    password: process.env.FRACTAL_ENGINE_AI_MYSQL_PASSWORD,
    db_name: process.env.FRACTAL_ENGINE_AI_MYSQL_DB_NAME,
    connectionLimit: 500,
  },
  settings: {
    use_google_drive: false,
    gd_folder_id: '',
    gd_auth_client_email: '',
    gd_auth_private_key: '',
    items_by_page: 60,
  },
  notificationServiceIP: process.env.FRACTAL_ENGINE_AI_NOTIFICATION_SERVICE_IP,
}
