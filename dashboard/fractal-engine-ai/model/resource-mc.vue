<script>
import {
  length,
  string,
} from '../resource/base-mc/vue-mc/validation'

import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'

let resourceNameRegex = /[^a-z\-]+/g
let sapaceRegex = /(^\s)/g


class ResourceModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('resource')
  }
  defaults () {
    return {
      id: 0,
      name: '',
      description: '',
      path: '',
      menu: false,
      records: false,
      icon: '',
      created_at: '',
      updated_at: '',
    }
  }
  mutations () {
    return {
      id: Number,
      name: String,
      description: String,
      type: String,
      path: String,
      menu: Boolean,
      records: Boolean,
      icon: String,
    }
  }
  validation () {
    return {
      name: value => {
        if (value.match(sapaceRegex))
          return "not spaces only '-'"

        if (value.match(resourceNameRegex))
          return 'only letters'

        if (value.length < 2)
          return 'must have a length of at least 2'

        return
      },
      description: string.and(length(2, 150)),
      path: value => {
        if (this.type !== 'data')
          return

        if (value === '')
          return 'required'
      },
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/resource/{id}/`,
      save: `${ CONFIG_MANIFEST.app_api_url }/resource/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/resource/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/resource/`,
    }
  }
}

class ResourceCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('resource')
  }
  model () {
    return ResourceModel
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
      fetchAll: `${ CONFIG_MANIFEST.app_api_url }/resource/items/all/`,
      fetch: `${ CONFIG_MANIFEST.app_api_url }/resource/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/resource/search/items`,
    }
  }
}

export default {
  model: ResourceModel,
  collection: ResourceCollection,
}
</script>
