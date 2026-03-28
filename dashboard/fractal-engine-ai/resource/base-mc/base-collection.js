import {
  Collection,
} from './vue-mc'
import CONFIG_MANIFEST from '../../config-manifest.js'


let isUserProfileLoaded = false

// load user profile first
// check use strict
// put the dashboard type or chnage de logic

export default class BaseCollection extends Collection {
  constructor (models = [], options = {}) {
    super(models, options)
    this._defaultMethodListener()
  }
  defaults () {
    return {
      page_number: 1,
      total_pages: 1,
      total_rows: 0,
      items_skipped: 0,
    }
  }
  listenPushMessages (modelName = '') {
    if (modelName === '')
      return

    if (isUserProfileLoaded) {
      this._registerDefaultEventNotification(modelName)
      return
    }
    CONFIG_MANIFEST.app.config.globalProperties.$emitter.on('app-user-profile-loaded', data => {
      isUserProfileLoaded = true
      this._registerDefaultEventNotification(modelName)
    })
  }
  _registerDefaultEventNotification (modelName = '') {
    let userPrefixUser = `${ CONFIG_MANIFEST.user_data.get('area_id') }-${ modelName }`
    this._module_event_methods(userPrefixUser)
  }
  listenPushGlobalMessages (modelName = '', event = '') {
    if (modelName === '')
      return

    if (isUserProfileLoaded) {
      this._registerCustomEventNotification(modelName, event)
      return
    }
    CONFIG_MANIFEST.app.config.globalProperties.$emitter.on('app-user-profile-loaded', data => {
      isUserProfileLoaded = true
      this._registerCustomEventNotification(modelName, event)
    })
  }
  _registerCustomEventNotification (modelName = '', event = '') {
    if (modelName === '')
      return

    let eventPrefix = `${ modelName }-${ event }`
    CONFIG_MANIFEST.app.config.globalProperties.$io.registerEvent(
      eventPrefix,
      data => {
        this.add(data.data)
        let lastModel = this.models.pop()
        this.models.unshift(lastModel)
        this.emit('notification', { method: event })
      }
    )
  }
  _module_event_methods (basePrefix) {
    CONFIG_MANIFEST.app.config.globalProperties.$io.registerEvent(
      `${ basePrefix }-post`,
      data => {
        let isCustomEntity = this.getOption('isCustomEntity')
        if (isCustomEntity !== null) {
          let prefix = this.getOption('prefix')
          let customEntityName = `${ prefix }-${ this.get('custom_entity_name') }`
          let customEntityRecordName = `${ prefix }-${ basePrefix.split('-')[2] }`
          if (customEntityName === customEntityRecordName)
            this.add(new CONFIG_MANIFEST.app.config.globalProperties.$model.CustomEntityRecordMC.model(data.data, null, {}, this.get('custom_entity_name')))
        } else
          this.add(data.data)
        let lastModel = this.models.pop()
        this.models.unshift(lastModel)
        this.sync()
        this.emit('notification', { method: 'post' })
      }
    )
    CONFIG_MANIFEST.app.config.globalProperties.$io.registerEvent(
    `${ basePrefix }-put`,
      data => {
        this.emit('notification', { method: 'put' })
      }
    )
    CONFIG_MANIFEST.app.config.globalProperties.$io.registerEvent(
      `${ basePrefix }-delete`,
      data => {
        this.emit('notification', { method: 'delete' })
      }
    )
  }
  _defaultMethodListener () {
    // this.on('fetch', e => {
    //   console.log('== fetch ==', e)
    // })
  }
  updatePageNumber () {
    let pageNumber = this.get('page_number')
    let totalPages = this.get('total_pages')
    this.set('total_pages', totalPages)
    if (pageNumber+1 > totalPages)
      return false

    pageNumber = pageNumber + 1
    this.set('page_number', pageNumber)
    return true
  }
  off (eventName) {
    delete this._listeners[eventName]
  }
  getHeaders () {
    return CONFIG_MANIFEST.app.config.globalProperties.$axios.defaults.headers.common
  }
  createRequest (config) {
    CONFIG_MANIFEST.headers = CONFIG_MANIFEST.app.config.globalProperties.$axios.defaults.headers.common
    return {
      send: () => CONFIG_MANIFEST.app.config.globalProperties.$axios(config).then(response => {
        return {
          getData: () => response.data,
          getStatus: () => response.status,
        }
      })
    }
  }
  getChangedModels () {
    return this.filter(model => {
      let id = model.get('_id')
      if (id === undefined || id === '')
        id = model.get('id')
      if (model.changed() || id === undefined) {
        return true
      }

      return false
    })
  }
  getModelsFromResponse (response) {
    // overriding
    return response.getData().items
  }
  _collectionFetch (methodName, routeName, params) {
    let method = methodName
    let route = this.getRoute(routeName)
    let url = this.getURL(route, this.getRouteParameters())
    let header = this.getHeaders()
    let config = {
      url,
      method,
      params,
      header,
    }
    let request = this.request(
      config,
      this.onFetch,
      this.onFetchSuccess,
      this.onFetchFailure,
    )
    request.then(data => {
      this.setPageDefauts({
        total_pages: data.getData().total_pages,
        total_rows: data.getData().total_items,
        items_skipped: data.getData().items_skipped,
      })
    })
    return request
  }
  fetchAll (params) {
    return this._collectionFetch(
      'GET',
      'fetchAll',
      params,
    )
  }
  search (params) {
    // NOTE: next page
    return this._collectionFetch(
      'GET',
      'search',
      params,
    )
  }
  // NOTE: page controller functions
  setPageDefauts (props) {
    this.set(props)
  }
  resetPageDefaults () {
    this.set('page_number', 1)
    this.set('total_pages', 1)
    this.set('items_rows', 0)
    this.set('items_skipped', 0)
  }
  setPrevPage () {
    let cn = this.get('page_number')
    if (cn <= 1)
      return false

    cn = cn - 1
    this.set('page_number', cn)
    return true
  }
  setNextPage () {
    let cn = this.get('page_number')
    let tp = this.get('total_pages')
    if (cn >= tp)
      return false

    cn = cn + 1
    this.set('page_number', cn)
    return true
  }
}
