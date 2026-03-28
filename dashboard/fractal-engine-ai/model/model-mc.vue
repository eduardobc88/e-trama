<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'


class Model extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
  }
  defaults () {
    return {
    }
  }
  validation () {
    return {}
  }
  mutations () {
    return {
    }
  }
  routes () {
    return {}
  }
  requiredValidation (val) {
    let type = typeof(val)
    if (type === 'number' && val <= 0)
      return 'required'

    if (val === undefined || val.length === 0)
      return 'required'

    return ''
  }
}

class Collection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
  }
  model () {
    return Model
  }
  defaults () {
    return {}
  }
  routes () {
    return {}
  }
}

export default {
  model: Model,
  collection: Collection,
}

</script>
