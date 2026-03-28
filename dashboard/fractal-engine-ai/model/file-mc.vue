<script>
import {
  length,
  string,
} from '../resource/base-mc/vue-mc/validation'

import BaseModel from '../resource/base-mc/base-model'
import BaseCollection from '../resource/base-mc/base-collection'
import CONFIG_MANIFEST from '../config-manifest.js'


class FileModel extends BaseModel {
  constructor (attributes = {}, collection = null, options = {}) {
    super(attributes, collection, options)
    this.listenPushMessages('file')
  }
  defaults () {
    return {
      id: 0,
      file_name: '',
      file_title: '',
      file_description: '',
      file_mime_type: '',
      file_size: '',
    }
  }
  mutations () {
    return {
      file_title: String,
      file_name: String,
      file_description: String,
      file_mime_type: String,
      file_size: String,
    }
  }
  validation () {
    return {
      file_title: string.and(length(2, 150)),
    }
  }
  isImage () {
    let mimetype = this.get('file_mime_type')
    if (mimetype === 'image/jpeg' || mimetype === 'image/png')
      return true

    return false
  }
  getFileURL () {
    let fileName = this.get('file_name')
    let url = `/upload/${ this.get('area_id') }/${ fileName }`
    return url
  }
  getPreviewURL (size) {
    let url = `/static/dashboard/fractal-engine-ai/assets/placeholder-file.jpeg`
    if (this.isImage()) {
      let fileName = this.get('file_name')
      url = `/upload/${ this.get('area_id') }/${fileName}`
    }
    return url
  }
  getGD (params) {
    return this._modelFetch(
      'GET',
      'getGD',
      params)
  }
  getGDFileURL (redirect = false) {
    return `${ CONFIG_MANIFEST.app_api_url }/file/google-drive/${ this.get('id') }/?redirect=${ redirect }`
  }
  getAttachmentGDFileURL (redirect = false) {
    return `${ CONFIG_MANIFEST.app_api_url }/file/google-drive/${ this.get('area_name') }/${ this.get('custom_entity_record_id') }/${ this.get('id') }/?redirect=${ redirect }`
  }
  getAttachment (params) {
    return this._modelFetch(
      'GET',
      'getAttachment',
      params)
  }
  routes () {
    return {
      fetch: `${ CONFIG_MANIFEST.app_api_url }/file/{id}/`,
      save: `${ CONFIG_MANIFEST.app_api_url }/file/`,
      put: `${ CONFIG_MANIFEST.app_api_url }/file/`,
      delete: `${ CONFIG_MANIFEST.app_api_url }/file/`,
      getGD: `${ CONFIG_MANIFEST.app_api_url }/file/google-drive/{id}/?redirect=false`,
      getAttachment: `${ CONFIG_MANIFEST.app_api_url }/file/{area_name}/{custom_entity_record_id}/{id}/`,
    }
  }
}

class FileCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
    this.listenPushMessages('file')
  }
  model () {
    return FileModel
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
      fetch: `${ CONFIG_MANIFEST.app_api_url }/file/items/{page_number}/`,
      search: `${ CONFIG_MANIFEST.app_api_url }/file/search/items/`,
    }
  }
}

export default {
  model: FileModel,
  collection: FileCollection,
}
</script>
