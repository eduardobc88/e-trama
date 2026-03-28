<script>
import {
  length,
  string,
  email,
} from '../resource/base-mc/vue-mc/validation'

import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class UserModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('user')
  }
  defaults () {
    return {
      id: 0,
      user_name: '',
      user_pass: '',
      user_email: '',
      user_first_name: '',
      user_last_name: '',
      user_active: false,
      role_id: 0,
      language_id: 0,
      created_at: '',
      updated_at: '',
      profile_file_id: 0,
      user_status: '',

      position: '',
      phone: '',
      theme: 1,
      file_ids: [],
      area_id: 0,
    }
  }
  mutations () {
    return {
      id: Number,
      user_name: String,
      user_pass: String,
      user_email: String,
      user_first_name: String,
      profile_file_id: Number,

      position: String,
      phone: String,
      area_id: Number,
      theme: Boolean,
    }
  }
  validation () {
    return {
      user_name: string.and(length(2, 100)),
      user_pass: value => {
        let id = this.get('id')
        if (id !== undefined && value === '')
          return

        if (value.length < 2 || value.length > 100)
          return 'must have a length between 2 and 100'

        return ''
      },
      user_email: email,
      user_first_name: string.and(length(2, 100)),
      role_id: value => {
        if (value === undefined || value === 0)
          return 'required'

        return ''
      },
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/user/{id}/`,
      save: `${ CONFIG_MANIFEST.app_api_url }/user/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/user/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/user/`,
    }
  }
}

class UserCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('user')
  }
  model () {
    return UserModel
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
      fetch: `${ CONFIG_MANIFEST.app_api_url }/user/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/user/search/items/`,
    }
  }
}

export default {
  model: UserModel,
  collection: UserCollection,
}

</script>
