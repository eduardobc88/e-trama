<script>
import BaseCollection from '../resource/base-mc/base-collection.js'
import BaseModel from '../resource/base-mc/base-model.js'
import CONFIG_MANIFEST from '../config-manifest.js'


class ElectionModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('election')
  }
  defaults () {
    return {
      id: 0,
      name: '',
      town_id: 0,
      pan: 0,
      pri: 0,
      prd: 0,
      pt: 0,
      pvem: 0,
      mc: 0,
      morena: 0,
      pes: 0,
      rsp: 0,
      fxm: 0,
      pan_pri_prd: 0,
      pan_pri: 0,
      pan_prd: 0,
      pri_prd: 0,
      pt_morena: 0,
      candidatos_no_registrados: 0,
      votos_nulos: 0,
      votos_validos: 0,
      total_votos: 0,
      lista_nominal: 0,
      participacion_ciudadana: 0.0,
    }
  }
  mutations () {
    return {
      id: Number,
      name: String,
      town_id: Number,
      pan: Number,
      pri: Number,
      prd: Number,
      pt: Number,
      pvem: Number,
      mc: Number,
      morena: Number,
      pes: Number,
      rsp: Number,
      fxm: Number,
      pan_pri_prd: Number,
      pan_pri: Number,
      pan_prd: Number,
      pri_prd: Number,
      pt_morena: Number,
      candidatos_no_registrados: Number,
      votos_nulos: Number,
      votos_validos: Number,
      total_votos: Number,
      lista_nominal: Number,
      participacion_ciudadana: Number,
    }
  }
  validation () {
    return {

    }
  }
  validateEmpty (value) {
    return ((value === undefined || value.length === 0)?'required':'')
  }
  routes () {
    return {

    }
  }
}

class ElectionCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('election')
  }
  model () {
    return ElectionModel
  }
  defaults () {
    return {
      scope: '',
      type: '',
      election: '',
    }
  }
  fetchResultFederal (params) {
    return this._collectionFetch(
      'GET',
      'fetchResultFederal',
      params,
    )
  }
  fetchResultLocal (params) {
    return this._collectionFetch(
      'GET',
      'fetchResultLocal',
      params,
    )
  }
  fetchResultTown (params) {
    return this._collectionFetch(
      'GET',
      'fetchResultTown',
      params,
    )
  }
  fetchResultSection (params) {
    return this._collectionFetch(
      'GET',
      'fetchResultSection',
      params,
    )
  }
  routes () {
    return {
      fetchResultFederal: `${ CONFIG_MANIFEST.app_api_url }/election/result/federal-district/{scope}/{type}/{election}/items/`,
      fetchResultLocal: `${ CONFIG_MANIFEST.app_api_url }/election/result/local-district/{scope}/{type}/{election}/items/`,
      fetchResultTown: `${ CONFIG_MANIFEST.app_api_url }/election/result/town/{scope}/{type}/{election}/items/`,
      fetchResultSection: `${ CONFIG_MANIFEST.app_api_url }/election/result/section/{scope}/{type}/{election}/items/`,
      fetch: `${ CONFIG_MANIFEST.app_api_url }/election/items/{state}/`,
    }
  }
}


export default {
  model: ElectionModel,
  collection: ElectionCollection,
}

</script>
