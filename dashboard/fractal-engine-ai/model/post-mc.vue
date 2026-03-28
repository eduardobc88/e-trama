<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class PostModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('post')
  }
  defaults () {
    return {
      id: 0,
      category_id: 0,
      title: '',
      file_id: 0,
      excerpt: '',
      content: '',
      file_ids: [],
      status: '',
      created_at: '',
      updated_at: '',
    }
  }
  mutations () {
    return {
      id: Number,
      category_id: Number,
      title: String,
      file_id: Number,
      excerpt: String,
      content: String,
      status: String,
      created_at: String,
      updated_at: String,
    }
  }
  validation () {
    return {
      category_id: value => {
        if (value === undefined || value <= 0)
          return 'required'

        return ''
      },
      title: value => {
        if (value === undefined || value.length === 0)
          return 'required'

        return ''
      },
      content: value => {
        if (value === undefined || value.length === 0)
          return 'required'

        return ''
      },
      status: value => {
        if (value === undefined || value.length === 0)
          return 'required'

        return ''
      },
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/post/{id}`,
      save: `${ CONFIG_MANIFEST.app_api_url }/post/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/post/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/post/`,
    }
  }
}

class PostCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages(false, 'post')
  }
  model () {
    return PostModel
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
      fetch: `${ CONFIG_MANIFEST.app_api_url }/post/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/post/search/items/`,
    }
  }
}

export default {
  model: PostModel,
  collection: PostCollection,
}

</script>
