<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class RegidorModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('candidate')
  }
  defaults () {
    return {
      id: 0,
      municipio: '',
      bloque: '',
      regidores: '',
      h1: 0,
      m1: 0,
      h2: 0,
      m2: 0,
      h3: 0,
      m3: 0,
      h4: 0,
      m4: 0,
      h5: 0,
      m5: 0,
    }
  }
  mutations () {
    return {
      id: Number,
    }
  }
  validation () {
    return {
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/candidate/{type}/{id}/`,
    }
  }
}

class RegidorCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('candidate')
  }
  model () {
    return RegidorModel
  }
  defaults () {
    return {
      type: '',
      page_number: 1,
      total_pages: '',
      total_skipped_items: '',
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/candidate/{type}/items/`,
    }
  }
}

export default {
  model: RegidorModel,
  collection: RegidorCollection,
}

</script>
