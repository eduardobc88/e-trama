<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


const REGEX_NAME = /^[a-zá-ü]+[a-zá-ü0-9\s]*[a-zá-ü]+$/

class CustomFieldModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('custom-field')
    this.eventListener()
  }
  eventListener () {
    this.on('notification', event => {
      let isActiveRequest = this.getOption('isActiveRequest')
      if (isActiveRequest && event.method !== 'put')
        return

      this.setOptionIndex('type')
    })
  }
  defaults () {
    return {
      id: 0,
      name: '',
      description: '',
      type: '',
      custom_list_id: 0,
      custom_entity_id: 0,
      custom_entity_field_id: 0,
      created_at: '',
      updated_at: '',
    }
  }
  getTypes () {
    return [
      {
        name: 'text',
      },
      {
        name: 'textarea',
      },
      {
        name: 'number',
      },
      {
        name: 'checkbox',
      },
      {
        name: 'file',
      },
      {
        name: 'date',
      },
      {
        name: 'list',
      },
      {
        name: 'entity',
      },
    ]
  }
  setOptionIndex (propName) {
    let value = this.get(propName)
    let index = -1
    let types = this.getTypes()
    for (let i in types) {
      let option = types[i]
      if (option.name === value) {
        index = i
        break
      }
    }
    this.setOption(`${ propName }_index`, index)
  }
  mutations () {
    return {
      id: Number,
      name: String,
      description: String,
      type: String,
      custom_list_id: Number,
      custom_entity_id: Number,
      custom_entity_field_id: Number,
      created_at: String,
      updated_at: String,
    }
  }
  validation () {
    return {
      name: value => {
        if (value === undefined || value.length === 0)
          return 'required'

        if (value.match(REGEX_NAME) === null)
          return 'no valid please use: "your name here"'

        return ''
      },
      type: value => {
        if (value === undefined || value.length === 0)
          return 'required'

        return ''
      },
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/custom-field/{id}/`,
      save: `${ CONFIG_MANIFEST.app_api_url }/custom-field/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/custom-field/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/custom-field/`,
    }
  }
}

class CustomFieldCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('custom-field')
  }
  model () {
    return CustomFieldModel
  }
  defaults () {
    return {
      page_number: '',
      total_pages: '',
      total_skipped_items: '',
    }
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/custom-field/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/custom-field/search/items/`,
    }
  }
}

export default {
  model: CustomFieldModel,
  collection: CustomFieldCollection,
}

</script>
