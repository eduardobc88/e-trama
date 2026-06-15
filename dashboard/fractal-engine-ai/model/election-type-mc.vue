<script>
import BaseCollection from '../resource/base-mc/base-collection.js'
import BaseModel from '../resource/base-mc/base-model.js'
import CONFIG_MANIFEST from '../config-manifest.js'


class ElectionTypeModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('election-type')
  }
  defaults () {
    return {
      id: 0,
      scope: '',
      election: 0,
      type: '',
    }
  }
  mutations () {
    return {
      id: Number,
      scope: String,
      election: Number,
      type: String,
    }
  }
  validation () {
    return {

    }
  }
  routes () {
    return {

    }
  }
}

class ElectionTypeCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('election-type')
  }
  model () {
    return ElectionTypeModel
  }
  defaults () {
    return {
      state: '',
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/election/type/items/`,
    }
  }
}


export default {
  model: ElectionTypeModel,
  collection: ElectionTypeCollection,
}

</script>
