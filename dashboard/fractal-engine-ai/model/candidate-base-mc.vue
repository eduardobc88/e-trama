<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


// NOTE: posible_cargo => REGIDOR, DIPUTADO LOCAL, PRESIDENCIA MUNICIPAL, SINDICO
// NOTE: acc_afirmativa => INDIGENA, JOVEN, JOVEN LGBTQIII+, LGBTTTOQ+, LGBTTTTIQ+, ORIGEN INDIGENA, ORIGEN PUREPECHA
// NOTE: genero: H, M
class CandidateBaseModel extends BaseModel {
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
      regidor_actual: '',
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

class CandidateBaseCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('candidate')
  }
  model () {
    return CandidateBaseModel
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
  model: CandidateBaseModel,
  collection: CandidateBaseCollection,
}

</script>
