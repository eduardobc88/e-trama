// NOTE: START - VENDORS
import {
  createApp,
} from 'vue'
import {
  createRouter,
  createWebHistory,
} from 'vue-router'
import mitt from 'mitt' // https://github.com/developit/mitt
import AXIOS from 'axios'
import withUUID from 'vue-uuid'
import _ from 'lodash'
import {
  createI18n
} from 'vue-i18n'
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/style.css'

// START - LOCAL VENDORS
import LIB from './resource/lib/lib.js'
import VALIDATE from './resource/lib/validate.js'
import SocketIO from './resource/lib/socket-io.js'

// NOTE: APP BASIC
import CONFIG_MANIFEST from './config-manifest.js'
import ROUTER_MANIFEST from './router-manifest.js'
import MODEL_MANIFEST from './model-manifest.js'
import DIRECTIVE_MANIFEST from './directive-manifest.js'


// START - TEMPLATES
import AppTemplate from './template/app.vue'


// START - INIT CONFIG
const APP = withUUID(createApp(AppTemplate))
CONFIG_MANIFEST.app = APP
const EMITTER = mitt()
const ROUTER_INSTANCE = createRouter({
  history: createWebHistory(),
  routes: ROUTER_MANIFEST.routes,
  base: CONFIG_MANIFEST.app_base_url,
})
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
    },
    es: {
    },
  },
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  missingWarn: false,
  fallbackWarn: false,
})

// START - SET CONFIG VALUES
AXIOS.defaults.xsrfCookieName = 'csrf-token'
AXIOS.defaults.xsrfHeaderName = 'csrf-token'
APP.config.globalProperties.$emitter = EMITTER
APP.config.globalProperties.$model = MODEL_MANIFEST
APP.config.globalProperties.$axios = AXIOS
APP.config.globalProperties.$_ = _
APP.config.globalProperties.$io = new SocketIO.IO()
APP.config.globalProperties.$appName = ''
APP.config.globalProperties.$appLoaded = false
APP.config.globalProperties.$config = CONFIG_MANIFEST
for (let name of Object.keys(LIB))
  APP.config.globalProperties[`$${ name }`] = LIB[name]
for (let name of Object.keys(VALIDATE))
  APP.config.globalProperties[`$${ name }`] = VALIDATE[name]
for (let directive of DIRECTIVE_MANIFEST)
  APP.directive(directive.name, directive.actions)


// START - INIT APP
APP.use(PerfectScrollbarPlugin, {})
APP.use(i18n)
APP.use(ROUTER_INSTANCE)


let lastPath = ''

APP.config.globalProperties.$emitter.on('app-user-profile-loaded', data => {
  if (!data.initial)
    return

  APP.config.globalProperties.$io.socketIOConnect()
  ROUTER_MANIFEST.rebuildRouter(ROUTER_INSTANCE)
  APP.config.globalProperties.$appLoaded = true
  if (lastPath === '' || lastPath === '/')
    return

  ROUTER_INSTANCE.replace(lastPath)
  // NOTE: LISTENERS FOR UPDATE ROLE RESOURCE OR USER
  APP.config.globalProperties.$io.registerEvent(
    'role-resources-put',
    data => {
      if (!(CONFIG_MANIFEST.user_data.get('role_id') === data.data.id))
        return

      CONFIG_MANIFEST.user_data.set('role_resources', data.data.role_resources)
    },
  )
  APP.config.globalProperties.$io.registerEvent(
    'user-put',
    data => {
      if (CONFIG_MANIFEST.user_data.get('id') === data.data.id)
        CONFIG_MANIFEST.user_data.set(data.data)
    },
  )
})

// NOTE: check for user permissions in router - Improve using Dynamic Route Matching
ROUTER_INSTANCE.beforeResolve((to, from, next) => {
  if (!APP.config.globalProperties.$appLoaded && lastPath === '') {
    lastPath = to.fullPath
    return next({
      name: 'wellcome',
    })
  }
  let isExceptionRouteName = CONFIG_MANIFEST.app_router_exception.indexOf(to.name) >= 0
  if (to.name === 'not-found' || isExceptionRouteName)
    return next()

  let isRoute = to.name.includes('record')
  let res = APP.config.globalProperties.$aclUserCan(to.name, isRoute)
  if (res)
    return next()

  next({
    name: 'not-found',
  })
})

APP.mount('#app')
