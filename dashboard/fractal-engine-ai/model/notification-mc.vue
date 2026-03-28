<script>
import {
  length,
  string,
} from '../resource/base-mc/vue-mc/validation'

import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class NotificationModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('notification')
  }
  defaults () {
    return {
      notification_title: '',
      notification_description: '',
      notification_type: '',
      created_at: '',
      user_id: 0,
    }
  }
  routes () {
    return {

    }
  }
}

class NotificationCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('notification')
  }
  model () {
    return NotificationModel
  }
  defaults () {
    return {
      page_number: 1,
      total_pages: '',
      total_skipped_items: '',
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/notification/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/notification/search/items/`,
    }
  }
}

export default {
  model: NotificationModel,
  collection: NotificationCollection,
}

</script>
