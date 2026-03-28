import {
  isEmpty,
} from 'lodash'
import {
  Model,
} from './vue-mc'
import CONFIG_MANIFEST from '../../config-manifest.js'


let isUserProfileLoaded = false

export default class BaseModel extends Model {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
  }
  listenPushMessages (modelName = '', customMethod = '') {
    if (modelName === '')
      return

    if (isUserProfileLoaded) {
      this._registerDefaultEventNotification(CONFIG_MANIFEST.user_data.get('area_id'), modelName, customMethod)
      return
    }
    CONFIG_MANIFEST.app.config.globalProperties.$emitter.on('app-user-profile-loaded', data => {
      isUserProfileLoaded = true
      this._registerDefaultEventNotification(CONFIG_MANIFEST.user_data.get('area_id'), modelName, customMethod)
    })
  }
  listenGlobalPushMessages (modelName = '', customMethod = '') {
    if (modelName === '')
      return

    if (isUserProfileLoaded) {
      this._registerDefaultEventNotification('', modelName, customMethod)
      return
    }
    CONFIG_MANIFEST.app.config.globalProperties.$emitter.on('app-user-profile-loaded', data => {
      isUserProfileLoaded = true
      this._registerDefaultEventNotification('' , modelName, customMethod)
    })
  }
  _registerDefaultEventNotification (userId = '', modelName = '', customMethod = '') {
    let userPrefixUser = modelName
    if (userId !== '')
      userPrefixUser = `${ CONFIG_MANIFEST.user_data.get('area_id') }-${ modelName }`
    this._module_event_methods(userPrefixUser, customMethod)
  }
  listenPushGlobalMessages (eventName = '') {
    if (eventName === '')
      return

    CONFIG_MANIFEST.app.config.globalProperties.$io.registerEvent(
      eventName,
      data => {
        let identifier = this.getOption('identifier')
        if (this.get(identifier) === data.data[identifier])
          this.set(data.data)
      }
    )
  }
  _module_event_methods (eventPrefix, customMethod) {
    CONFIG_MANIFEST.app.config.globalProperties.$io.registerEvent(
      `${ eventPrefix }-put`,
      data => {
        let identifier = this.getOption('identifier')
        if (this.get(identifier) !== data.data[identifier])
          return

        this.set(data.data)
        this.sync()
        this.emit('notification', { method: 'put' })
      }
    )
    CONFIG_MANIFEST.app.config.globalProperties.$io.registerEvent(
      `${ eventPrefix }-delete`,
      data => {
        let identifier = this.getOption('identifier')
        if (this.get(identifier) !== data.data[identifier])
          return

        this.removeFromAllCollections()
        this.emit('notification', { method: 'delete' })
      }
    )
    if (customMethod !== '') {
      CONFIG_MANIFEST.app.config.globalProperties.$io.registerEvent(
        `${ eventPrefix }-${ customMethod }`,
        data => {
          this.emit('notification', { method: customMethod })
          CONFIG_MANIFEST.app.config.globalProperties.emit('dashboard-show-login', '')
        }
      )
    }
  }
  off (eventName) {
    delete this._listeners[eventName]
  }
  getHeaders () {
    return CONFIG_MANIFEST.app.config.globalProperties.$axios.defaults.headers.common
  }
  createRequest (config) {
    // NOTE: overriding - using custom axios instance
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
  onFetchSuccess (response) {
    // NOTE: overriding
    let attributes = response.getData().data
    // A fetch request must receive *some* data in return.
    if (isEmpty(attributes))
      throw this.createResponseError('No data in fetch response', response)
    this.assign(attributes)
    this['falta'] = false
    this['loading'] = false
    this.emit('fetch', { error: null })
  }
  update (data) {
    // NOTE: overriding
    return super.update(data.data)
  }
  options () {
    return {
      identifier: 'id',
      validateOnChange: true,
      validateRecursively: true,
      useFirstErrorOnly: true,
      saveUnchanged: false,
      mutateOnChange: true,
      isActiveRequest: false, // custom option
    }
  }
  _modelFetch (methodName, routeName, params) {
    let method = methodName
    let route = this.getRoute(routeName)
    let url = this.getURL(route, this.getRouteParameters())
    let header = this.getHeaders()
    let data = this._attributes
    let config = {
      url,
      method,
      data,
      params,
      header,
    }
    let request = this.request(
      config,
      this.onFetch,
      this.onFetchSuccess,
      this.onFetchFailure
    )
    return request
  }
  _modelSave (methodName, routeName, params) {
    let method = methodName
    let route = this.getRoute(routeName)
    let url = this.getURL(route, this.getRouteParameters())
    let header = this.getHeaders()
    let data = this._attributes
    let config = {
      url,
      method,
      data,
      params,
      header,
    }
    let request = this.request(
      config,
      this.onSave,
      this.onSaveSuccess,
      this.onSaveFailure)
    return request
  }
  _modelDelete (methodName, routeName, params) {
    let method = methodName
    let route = this.getRoute(routeName)
    let url = this.getURL(route, this.getRouteParameters())
    let header = this.getHeaders()
    let data = this._attributes
    let config = {
      url,
      method,
      data,
      params,
      header,
    }
    let request = this.request(
      config,
      this.onDelete,
      this.onDeleteSuccess,
      this.onDeleteFailure)
    return request
  }
  save (params) {
    return this._modelSave(
      'POST',
      'save',
      params)
  }
  put (params) {
    return this._modelSave(
      'PUT',
      'put',
      params)
  }
  delete (params) {
    return this._modelDelete(
      'DELETE',
      'delete',
      params)
  }
  // NOTE: START DYNAMIC PROPS
  addCustomProp (name, value) {
    this._attributes[name] = value
    this._mutations[name] = ((typeof(value) === 'number')?Number:String)
    this.set(name, value)
  }
  removeCustomProp (model, propName, defaultProps) {
    delete model._attributes[propName]
    delete model._mutations[propName]
    defaultProps.splice(1, defaultProps.indexOf(propName))
  }
  clearCustomProp (model) {
    model._attributes = []
    model._mutations = []
  }
  addCustomValidation (name, value) {
    this._attributes[name] = value
    this._mutations[name] = ((typeof(value) === 'number')?Number:String)
    this.set(name, value)
  }
  // NOTE: END DYNAMIC PROPS
}
