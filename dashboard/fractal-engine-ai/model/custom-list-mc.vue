<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


const REGEX_NAME = /([a-z]|[á-ü])+[-\s\S]*([a-z]|[á-ü])+$/

class CustomListModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('custom-list')
  }
  defaults () {
    return {
      id: 0,
      name: '',
      description: '',
      data: [],
      created_at: '',
      updated_at: '',
    }
  }
  mutations () {
    return {
      id: Number,
      name: String,
      description: String,
      created_at: String,
      updated_at: String,
    }
  }
  validation () {
    return {
      name: value => {
        if (value === undefined || value.length === 0)
          return 'required'

        if (value.match(REGEX_NAME) === null)
          return 'no valid please use: custom-name, name'

        return ''
      },
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/custom-list/{id}`,
      save: `${ CONFIG_MANIFEST.app_api_url }/custom-list/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/custom-list/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/custom-list/`,
    }
  }
}

class CustomListCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('custom-list')
  }
  model () {
    return CustomListModel
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
      fetch: `${ CONFIG_MANIFEST.app_api_url }/custom-list/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/custom-list/search/items/`,
    }
  }
}

export default {
  model: CustomListModel,
  collection: CustomListCollection,
}

</script>
