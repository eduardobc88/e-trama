<script>
import BaseCollection from '../resource/base-mc/base-collection'
import CONFIG_MANIFEST from '../config-manifest.js'


class SearchFileCollection extends BaseCollection {
  constructor (models = [], options = {}) {
    super(models, options)
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
      search: `${ CONFIG_MANIFEST.app_api_url }/files/`,
    }
  }
}

export default {
  collection: SearchFileCollection,
}
</script>
