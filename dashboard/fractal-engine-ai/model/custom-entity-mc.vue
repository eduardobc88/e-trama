<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


const REGEX_NAME = /^[a-zá-ü]+[a-zá-ü\s]*[a-zá-ü]+$/

class CustomEntityModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('custom-entity')
  }
  defaults () {
    return {
      id: 0,
      name: '',
      resource_name: '',
      description: '',
      prefix: '',
      suffix: '',
      number: 0,
      custom_entity_fields: [], // NOTE: custom field data: { id: 0, custom_entity_id: 0, custom_field_id: 0, active: true}
      custom_entity_role_permissions: [], // NOTE: HAS THE EARCH ROLE RESOURCE PERMISSION RESOURCE
      created_at: '',
      updated_at: '',

      resource_id: 0,
    }
  }
  mutations () {
    return {
      id: Number,
      name: String,
      resource_name: String,
      description: String,
      prefix: String,
      suffix: String,
      number: Number,
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
          return 'no valid please use: module-name'

        return ''
      },
    }
  }
  fetchByName (params) {
    return this._modelFetch(
      'GET',
      'fetchByName',
      params)
  }
  routes () {
    return {
      fetchByName: `${ CONFIG_MANIFEST.app_api_url }/custom-entity/name/{name}/`,
      fetch: `${ CONFIG_MANIFEST.app_api_url }/custom-entity/{id}/`,
      save: `${ CONFIG_MANIFEST.app_api_url }/custom-entity/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/custom-entity/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/custom-entity/`,
    }
  }
}

class CustomEntityCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('custom-entity')
  }
  model () {
    return CustomEntityModel
  }
  defaults () {
    return {
      custom_entity_id: 0,
      page_number: '',
      total_pages: '',
      total_skipped_items: '',
    }
  }
  searchField (params) {
    return this._collectionFetch(
      'GET',
      'searchField',
      params,
    )
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/custom-entity/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/custom-entity/search/items/`,
      searchField: `${ CONFIG_MANIFEST.app_api_url }/custom-entity/search/{custom_entity_id}/field/items/`,
    }
  }
}

export default {
  model: CustomEntityModel,
  collection: CustomEntityCollection,
}

</script>
