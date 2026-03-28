<script>
import {
  length,
  string,
} from '../resource/base-mc/vue-mc/validation'

import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class LanguageModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('language')
  }
  defaults () {
    return {
      id: 0,
      language_name: '',
      created_at: '',
      updated_at: '',
      language_messages: [],
    }
  }
  mutations () {
    return {
      id: Number,
      language_name: String,
    }
  }
  validation () {
    return {
      language_name: value => {
        if (value.length < 2)
          return 'must have a length of at least 2'

        return
      },
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/language/{id}/`,
      save: `${ CONFIG_MANIFEST.app_api_url }/language/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/language/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/language/`,
    }
  }
}

class LanguageCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('language')
  }
  model () {
    return LanguageModel
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
      fetchAll: `${ CONFIG_MANIFEST.app_api_url }/language/items/all/`,
      fetch: `${ CONFIG_MANIFEST.app_api_url }/language/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/language/search/items/`,
    }
  }
}

export default {
  model: LanguageModel,
  collection: LanguageCollection,
}
</script>
