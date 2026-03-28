<script>
import {
  integer,
  length,
  string,
  min,
  url,
} from '../resource/base-mc/vue-mc/validation'

import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class SiteModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('site-setting')
  }
  defaults () {
    return {
      site_name: '',
      site_items_peer_page: '',
      site_url: '',
      site_template_home: '',
      site_template_posts: '',
      site_theme: '',
    }
  }
  mutations () {
    return {
      site_name: String,
      site_items_peer_page: Number,
      site_url: String,
    }
  }
  validation () {
    return {
      setting_page_title: string.and(length(2, 150)),
      site_name: string.and(length(2, 150)),
      site_items_peer_page: value => {
        if (value < 1 || value > 40) {
          return 'Must have a number between 1 and 40'
        }
      },
      site_url: url.and(length(2, 150)),
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/site/`,
      post: `${ CONFIG_MANIFEST.app_api_url }/site/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/site/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/site/`,
    }
  }
}

export default {
  model: SiteModel,
}
</script>
