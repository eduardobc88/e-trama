<script>
import BaseCollection from '../resource/base-mc/base-collection'
import BaseModel from '../resource/base-mc/base-model'
import CONFIG_MANIFEST from '../config-manifest.js'


class CardModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('card')
  }
  defaults () {
    return {
      id: 0,
      town_id: 0,
      link_name: '',
      local_district: 0,
      federal_district: 0,
      phone: '',
      town_authority_list_json: [], // name, position
      possible_candidate_list_json: [], // name, position
      town_actor_list_json: [], // name, position, abr
      group_list_json: [],  // name, representative
      group_description: '',
      advice_list_json: [], // name, position, abr
      numerals_list_json: [], // cot, total_promoted, total_committees, total_committes_members
      created_at: '',
      updated_at: '',
    }
  }
  mutations () {
    return {
      id: Number,
      town_id: Number,
      link_name: String,
      local_district: Number,
      federal_district: Number,
      phone: Number,
      town_authority_list_json: [],
      possible_candidate_list_json: [],
      town_actor_list_json: [],
      group_list_json: [],
      group_description: String,
      advice_list_json: [],
      numerals_list_json: [],
    }
  }
  validation () {
    return {
      link_name: val => {
        if (val.toString().length === 0)
          return 'requerido'

        return ''
      },
      town_id: val => {
        if (val === 0)
          return 'requerido'

        return ''
      },
      local_district: val => {
        if (val.toString().length === 0)
          return 'requerido'

        if (val.toString() === '0')
          return 'introduce un número valido'

        if (isNaN(Number(val)))
          return 'introduce un número'
        
        return ''
      },
      federal_district: val => {
        if (val.toString().length === 0)
          return 'requerido'

        if (val.toString() === '0')
          return 'introduce un número valido'

        if (isNaN(Number(val)))
          return 'introduce un número'
        
        return ''
      },
      phone: val => {
        if (val.toString().length === 0)
          return 'requerido'

        if (val.toString() === '0' || val.toString().length > 10 || val.toString().length <= 0)
          return 'introduce un número valido'

        return ''
      },
    }
  }
  fetchByTown (params) {
    return this._modelFetch(
      'GET',
      'fetchByTown',
      params,
      )
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/card/{id}/`,
      fetchByTown: `${ CONFIG_MANIFEST.app_api_url }/card/town/{id}/`,
      save: `${ CONFIG_MANIFEST.app_api_url }/card/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/card/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/card/`,
    }
  }
}

class CardCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('card')
  }
  model () {
    return CardModel
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
      search: `${ CONFIG_MANIFEST.app_api_url }/card/{page_number}/`,
      fetch: `${ CONFIG_MANIFEST.app_api_url }/card/items/{page_number}/`,
    }
  }
}

export default {
  model: CardModel,
  collection: CardCollection,
}

</script>