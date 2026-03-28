<script>
import BaseCollection from '../resource/base-mc/base-collection'
import CONFIG_MANIFEST from '../config-manifest.js'


class Search extends BaseCollection {
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
      fetch: `${ CONFIG_MANIFEST.app_api_url }/search/`,
    }
  }
}

export default {
  collection: Search,
}
</script>
