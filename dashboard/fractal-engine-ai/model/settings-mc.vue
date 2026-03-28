<script>
import {
  length,
  string,
  email,
} from '../resource/base-mc/vue-mc/validation'

import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class SettingsModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('settings')
  }
  defaults () {
    return {
      id: 0,
      use_google_drive: false,
      gd_folder_id: '',
      gd_auth_client_email: '',
      gd_auth_private_key: '',
      items_by_page: 60,
    }
  }
  mutations () {
    return {
      id: Number,
      use_google_drive: Boolean,
      gd_folder_id: String,
      gd_auth_client_email: String,
      gd_auth_private_key: String,
      items_by_page: Number,
    }
  }
  validation () {
    return {
      use_google_drive: val => {
        if (val)
          this.validation()
        return ''
      },
      items_by_page: val => {
        if (val !== undefined && (val < 1 || val > 100))
          return 'number between 1 and 100'

        return ''
      },
      gd_folder_id: val => {
        if (!this.use_google_drive)
          return ''

        if (!val.length)
          return 'required'

        return ''
      },
      gd_auth_client_email: val => {
        if (!this.use_google_drive)
          return ''

        if (!val.length)
          return 'required'

        return ''
      },
      gd_auth_private_key: val => {
        if (!this.use_google_drive)
          return ''

        if (!val.length)
          return 'required'

        return ''
      },
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/settings/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/settings/`,
    }
  }
}

export default {
  model: SettingsModel,
}
</script>
