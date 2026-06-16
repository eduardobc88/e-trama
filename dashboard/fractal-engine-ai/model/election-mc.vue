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
  getSumProps (type = '') {
    let props = {}
    if (type === 'federal' || type === 'local')
      props = {
        'total_votos': 0,
      }
    else if (type === 'town' || type === 'section')
      props = {
        'total_votos': 0,
        'num_votos_validos': 0,
        'num_votos_nulos': 0,
        'votos_mc': 0,
        'votos_morena': 0,
        'votos_pan': 0,
        'votos_pes': 0,
        'votos_prd': 0,
        'votos_pri': 0,
        'votos_pt': 0,
      }
    return props
  }
  setDefaultProps (type = '') {
    let props = {}
    if (type === 'federal' || type === 'local')
      props = {
        district_id: 0,
        header: '',
        total_votos: '',
        votos_mc: '',
        votos_morena: '',
        votos_pan: '',
        votos_pes: '',
        votos_prd: '',
        votos_pri: '',
        votos_pt: '',
        casillas: '',
        lista_nominal: '',
        num_votos_nulos: '',
        num_votos_validos: '',
        total_votos: '',
        ganador_votos: 0,
        ganador: '',
      }
    else if (type == 'town')
      props = {
        id: 0,
        type: '',
        election: 0,
        scope: '',
        town_id: 0,
        municipio: '',
        votos_mc: '',
        votos_morena: '',
        votos_pan: '',
        votos_pes: '',
        votos_prd: '',
        votos_pri: '',
        votos_pt: '',
        casillas: '',
        lista_nominal: '',
        num_votos_nulos: '',
        num_votos_validos: '',
        total_votos: '',
        ganador_votos: 0,
        ganador: '',
      }
    else if (type === 'section')
      props = {
        id: 0,
        type: '',
        election: 0,
        scope: '',
        header: '',
        district_f_id: 0,
        district_l_id: 0,
        town_id: 0,
        municipio: '',
        section_id: 0,
        votos_mc: 0,
        votos_morena: 0,
        votos_pan: 0,
        votos_pes: 0,
        votos_prd: 0,
        votos_pri: 0,
        votos_pt: 0,
        casillas: 0,
        lista_nominal: 0,
        num_votos_nulos: 0,
        num_votos_validos: 0,
        total_votos: 0,
        ganador_votos: 0,
        ganador: '',
      }
    for (let key of Object.keys(props))
      this.addCustomProp(key, props[key])
    return props
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
      fetchResultFederal: `${ CONFIG_MANIFEST.app_api_url }/election/result/federal-district/items/?scope={scope}&type={type}&election={election}`,
      fetchResultLocal: `${ CONFIG_MANIFEST.app_api_url }/election/result/local-district/items/?scope={scope}&type={type}&election={election}`,
      fetchResultTown: `${ CONFIG_MANIFEST.app_api_url }/election/result/town/items/?scope={scope}&type={type}&election={election}`,
      fetchResultSection: `${ CONFIG_MANIFEST.app_api_url }/election/result/section/items/?scope={scope}&type={type}&election={election}`,
      fetch: `${ CONFIG_MANIFEST.app_api_url }/election/items/{state}/`,
    }
  }
}


export default {
  model: ElectionModel,
  collection: ElectionCollection,
}

</script>
