<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class CategoryModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('category')
  }
  defaults () {
    return {
      id: 0,
      name: '',
      description: '',
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
      title: value => {
        if (value === undefined || value.length === 0)
          return 'required'

        return ''
      },
      description: value => {
        if (value === undefined || value.length === 0)
          return 'required'

        return ''
      },
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/category/{id}`,
      save: `${ CONFIG_MANIFEST.app_api_url }/category/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/category/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/category/`,
    }
  }
}

class CategoryCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('category')
  }
  model () {
    return CategoryModel
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
      fetch: `${ CONFIG_MANIFEST.app_api_url }/category/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/category/search/items/`,
    }
  }
}

export default {
  model: CategoryModel,
  collection: CategoryCollection,
}

</script>
