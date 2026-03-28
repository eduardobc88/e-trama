<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class FeedbackModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('feedback')
  }
  defaults () {
    return {
      id: 0,
      user_id_ref: '',
      feedback_title: '',
      feedback_description: '',
      category_id: 0,
      created_at: '',
      updated_at: '',
    }
  }
  mutations () {
    return {
      id: Number,
      category_id: Number,
      feedback_title: String,
      feedback_description: String,
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
      feedback_title: value => {
        if (value === undefined || value.length === 0)
          return 'required'
      },
      feedback_description: value => {
        if (value === undefined || value.length === 0)
          return 'required'
      },
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/feedback/{id}`,
      save: `${ CONFIG_MANIFEST.app_api_url }/feedback/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/feedback/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/feedback/`,
    }
  }
}

class FeedbackCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('feedback')
  }
  model () {
    return FeedbackModel
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
      fetch: `${ CONFIG_MANIFEST.app_api_url }/feedback/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/feedback/search/items/`,
    }
  }
}

export default {
  model: FeedbackModel,
  collection: FeedbackCollection,
}

</script>
