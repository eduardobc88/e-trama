<script>
import {
  length,
  string,
} from '../resource/base-mc/vue-mc/validation'

import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class RoleModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('role')
    this.listenGlobalPushMessages('role-resources')
  }
  defaults () {
    return {
      id: 0,
      role_name: '',
      created_at: '',
      updated_at: '',
      role_resources: [],
    }
  }
  mutations () {
    return {
      role_name: String,
    }
  }
  validation () {
    return {
      role_name: string.and(length(2, 150)),
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/role/{id}/`,
      save: `${ CONFIG_MANIFEST.app_api_url }/role/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/role/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/role/`,
    }
  }
}

class RoleCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('role')
  }
  model () {
    return RoleModel
  }
  defaults () {
    return {
      page_number: '',
      total_pages: '',
      total_skipped_items: '',
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/role/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/role/search/items/`,
    }
  }
}

export default {
  model: RoleModel,
  collection: RoleCollection,
}

</script>
