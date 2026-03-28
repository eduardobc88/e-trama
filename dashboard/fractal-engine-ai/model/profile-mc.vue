<script>
import {
  length,
  string,
  email,
} from '../resource/base-mc/vue-mc/validation'

import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class ProfileModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('profile')
  }
  defaults () {
    return {
      id: 0,
      user_name: '',
      user_email: '',
      user_first_name: '',
      user_last_name: '',
      role_id: 0,
      user_pass: '',
      role_resources: [],
      profile_file_id: 0,
      user_status: 'offline',

      position: '',
      state_id: 0,
      district_id: 0,
      town_id: 0,
      phone: '',
      theme: 1,
      file_ids: [],
    }
  }
  mutations () {
    return {
      id: Number,
      user_name: String,
      user_email: String,
      user_first_name: String,
      language_id: Number,
      role_id: Number,
      profile_file_id: Number,

      position: String,
      phone: String,
      curp: String,
      ine: String,
      state_id: Number,
      district_id: Number,
      town_id: Number,
      address: String,
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

        return
      },
      user_email: email,
      user_first_name: string.and(length(2, 100)),
      position: string.and(length(2, 100)),
      phone: value => {
        if (value === undefined || value.length === 0)
          return 'required'

        if (value.length !== 10)
          return 'deben ser 10 digitos'

        return ''
      },
      address: string.and(length(2, 300)),
      role_id: value => {
        if (value === undefined || value === 0)
          return 'required'

        return ''
      },
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/profile/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/profile/`,
    }
  }
}

export default {
  model: ProfileModel,
}
</script>
