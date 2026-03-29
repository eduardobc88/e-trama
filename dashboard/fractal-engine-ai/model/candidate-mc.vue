<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class CandidateModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('candidate')
  }
  defaults () {
    return {
      id: 0,
      no_lista: 0,
      distrito_local: 0,
      bloque: '',
      municipio: '',
      nombre: '',
      felefono: '',
      posible_cargo: '',
      genero: '',
      acc_afirmativa: '',
      observaciones: '',
      referente: '',
      tipo: '',
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

class CandidateCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('candidate')
  }
  model () {
    return CandidateModel
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
  model: CandidateModel,
  collection: CandidateCollection,
}

</script>