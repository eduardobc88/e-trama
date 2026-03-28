<script>
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class DashboardSettingModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('settings')
  }
  defaults () {
    return {
      setting_page_title: '',
      setting_items_peer_page: '',
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/dashboard-settings/`,
    }
  }
}

export default {
  model: DashboardSettingModel,
}
</script>
