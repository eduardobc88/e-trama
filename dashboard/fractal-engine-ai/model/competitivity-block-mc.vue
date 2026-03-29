<script>
import BaseCollection from '../resource/base-mc/base-collection.js'
import BaseModel from '../resource/base-mc/base-model.js'


class CompetitivityBlockModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages(true, 'competitivity-block')
  }
  defaults (props = {}) {
    let defaultProps = {
      id: 0,
      name: '',
      total_votos: 0,
      block: '', // NOTE: 'alto', 'medio', 'bajo'
    }
    if (Object.keys(props).length)
      defaultProps = Object.assign(defaultProps, props)
    return defaultProps
  }
  mutations (props = {}) {
    let defaultProps = {
      id: Number,
      name: String,
      total_votos: Number,
    }
    if (Object.keys(props).length)
      defaultProps = Object.assign(defaultProps, props)
    return defaultProps
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

class CompetitivityBlockCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages(true, 'competitivity-block')
  }
  model () {
    return CompetitivityBlockModel
  }
  defaults () {
    return {
    }
  }
  routes () {
    return {

    }
  }
}

export default {
  model: CompetitivityBlockModel,
  collection: CompetitivityBlockCollection,
}

</script>
