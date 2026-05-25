<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class FeatureModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('feature')
  }
  defaults () {
    return {
      id: 0,
      header: '',
      name: '',
      description: '',
      color: '',
      district_id: 0,
      entity_id: 0,
    }
  }
  mutations () {
    return {
      id: Number,
      header: String,
      name: String,
      description: String,
      color: String,
      district_id: Number,
      entity_id: Number,
    }
  }
  routes () {
    return {
    }
  }
}

class FeatureCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('feature')
  }
  model () {
    return FeatureModel
  }
  defaults () {
    return {
      feature_type: '',
    }
  }
  routes () {
    return {
      fetchAll: `${ CONFIG_MANIFEST.app_api_url }/feature/items/{feature_type}/`,
    }
  }
}

export default {
  model: FeatureModel,
  collection: FeatureCollection,
}

</script>
