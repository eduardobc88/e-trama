<script>
import CONFIG_MANIFEST from '../config-manifest.js'
import BaseModel from '../resource/base-mc/base-model'
import BaseCollection from '../resource/base-mc/base-collection'


class Model extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('session')
  }
  options () {
    return {
      identifier: 'id',
      validateOnChange: true,
      validateRecursively: true,
      useFirstErrorOnly: true,
      saveUnchanged: false,
      mutateOnChange: true,
      isActiveRequest: false,
    }
  }
  defaults () {
    return {
      id: 0,
      status: '',
    }
  }
  mutations () {
    return {
      status: Number,
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

export default {
  model: Model,
}
</script>
