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
    }
  }
  mutations () {
    return {
      id: Number,
    }
  }
  validation () {
    return {}
  }
  routes () {
    return {}
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
