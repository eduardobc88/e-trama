<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'

const CUSTOM_ENTITY_RECORD_PREFIX = 'cer'


class CustomEntityRecordModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}, modelName = '') {
    super(attributes, collection, options)
    this.set('custom_entity_name', modelName)
    this.setOption('isCustomEntity', true)
    this.setOption('identifier', 'id')
    this.setOption('prefix', CUSTOM_ENTITY_RECORD_PREFIX)
    this.listenPushMessages(`${ CUSTOM_ENTITY_RECORD_PREFIX }-${ modelName }`)
  }
  defaults () {
    return {
      // NOTE: DEFAULT PROPERTIES
      id: 0,
      created_user_id: 0,
      updated_user_id: 0,

      created_at: '',
      updated_at: '',
      deleted_at: '',
      attachment_files: [],
      related_records: [],
    }
  }
  validation () {
    return {
    }
  }
  getCurrentDate () {
    let date = new Date()
    let mm = (date.getMonth() + 1).toString().padStart(2, '0')
    let dd = date.getDate().toString().padStart(2, '0')
    let currentDate = `${date.getFullYear()}-${mm}-${dd}`
    let h = date.getHours().toString().padStart(2, '0')
    let m = date.getMinutes().toString().padStart(2, '0')
    let s = date.getSeconds().toString().padStart(2, '0')
    let currentTime = `${ h }:${ m }:${ s }`
    return `${ currentDate } ${ currentTime }`
  }
  getPropOptions (propName) {
    return []
  }
  getSelectIndex (propName) {
    let index = -1
    let optionItems = []
    optionItems = this.getPropOptions(propName)
    for (let i in optionItems) {
      let option = optionItems[i]
      if (option.name === this.get(propName)) {
        index = i
        break
      }
    }
    return index
  }
  mutations () {
    return {
      id: Number,
      created_user_id: Number,
      updated_user_id: Number,
      created_at: String,
      updated_at: String,
      deleted_at: String,
    }
  }
  fetchRelatedRecord (params) {
    return this._modelFetch(
      'GET',
      'fetchRelatedRecord',
      params)
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/custom-entity-record/{custom_entity_name}/{id}/`,
      save: `${ CONFIG_MANIFEST.app_api_url }/custom-entity-record/{custom_entity_name}/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/custom-entity-record/{custom_entity_name}/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/custom-entity-record/{custom_entity_name}/`,
      fetchRelatedRecord: `${ CONFIG_MANIFEST.app_api_url }/custom-entity-record/{custom_entity_name}/{id}/related-record/{related_record_id}/{origin_area_id}/{destination_area_id}/`,
    }
  }
}

class CustomEntityRecordCollection extends BaseCollection {
  constructor (models = [], options = {}, modelName = '') {
    super(models, options)
    this.set('custom_entity_name', modelName)
    this.setOption('isCustomEntity', true)
    this.setOption('identifier', 'id')
    this.setOption('prefix', CUSTOM_ENTITY_RECORD_PREFIX)
    this.listenPushMessages(`${ CUSTOM_ENTITY_RECORD_PREFIX }-${ modelName }`)
  }
  model () {
    return CustomEntityRecordModel
  }
  defaults () {
    return {
      page_number: '',
      total_pages: '',
      total_skipped_items: '',
    }
  }
  searchInCustomEntityRecord (searchInCustomEntity = '', params) {
    this.set('search_custom_entity_name', searchInCustomEntity)
    return this._collectionFetch(
      'GET',
      'searchInCustomEntityRecord',
      params,
    )
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/custom-entity-record/{custom_entity_name}/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/custom-entity-record/related-record/search/items/`,
      searchInCustomEntityRecord: `${ CONFIG_MANIFEST.app_api_url }/custom-entity-record/{search_custom_entity_name}/search/items/`,
    }
  }
}

export default {
  model: CustomEntityRecordModel,
  collection: CustomEntityRecordCollection,
}

</script>
