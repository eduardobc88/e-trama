<template>
  <div>
    <Grid v-if="items !== null">
      <template #slota>
        <ListTable
          v-bind:collection="items"
          v-bind:onClickRow="showDetail"
          v-bind:navigationBefore="navigationBefore"
          v-bind:navigationNext="navigationNext"
          v-bind:currentPage="currentPage"
          v-bind:totalPages="totalPages"
          v-bind:itemsSkipped="totalSkippedItems"
          v-bind:totalItems="totalItems"
          v-bind:rowButtons="rowButtons"
          v-bind:modelKey="modelKey"
          v-bind:keyThumbnail="keyThumbnail"
          v-bind:isLoading="isLoading"
          v-bind:model="model"
          v-bind:modelPrefix="modelPrefix"
          v-bind:modelDefaultProps="modelDefaultProps"
          v-bind:identifier="identifier"
          v-bind:isOverBody="true"
          v-bind:rowChip="rowChip"/>
        <div
          id="list-navigation">
          <div
            class="data">
            {{ $t('rows from') }} {{ totalSkippedItems + 1 }} {{ $t('to') }}
            {{ totalSkippedItems + items.getModels().length }} {{ $t('of') }} {{ totalItems }}
          </div>
          <div
            class="data">
            {{ $t('page') }} {{ currentPage }} {{ $t('of') }} {{ totalPages }}
          </div>
          <ButtonIcon
            buttonIcon="first_page"
            v-bind:buttonAction="navigationFirst"/>
          <ButtonIcon
            buttonIcon="navigate_before"
            v-bind:buttonAction="navigationBefore"/>
          <ButtonIcon
            buttonIcon="navigate_next"
            v-bind:buttonAction="navigationNext"/>
          <ButtonIcon
            buttonIcon="last_page"
            v-bind:buttonAction="navigationLast"/>
        </div>
      </template>
    </Grid>
    <FloatButtonIcon
      v-if="listTypeNew !== ''"
      buttonText="New"
      buttonIcon="note_add"
      v-bind:buttonAction="openNew"/>
  </div>
</template>

<script>
import {
  useRouter,
  useRoute
} from 'vue-router'

import ButtonIcon from '../component/button-icon.vue'
import FloatButtonIcon from '../component/float-button-icon.vue'
import Grid from '../component/grid.vue'
import ListTable from '../component/list-table.vue'

export default {
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      routerNameClean: '',
      customEntity: new this.$model.CustomEntityMC.model(),
      listTypeDetail: '',
      listTypeNew: '',
      headerTitle: '',
      headerDescription: '',
      items: null,
      currentPage: 1,
      totalPages: 1,
      totalSkippedItems: -1,
      totalItems: 0,
      isLoading: false,
      routeName: '',
      identifier: '',
      rowButtons: [],
      keyThumbnail: {},
      modelKey: {},
      model: null,
      modelPrefix: '',
      modelDefaultProps: [],
      rowChip: null,
    }
  },
  components: {
    ButtonIcon,
    FloatButtonIcon,
    Grid,
    ListTable,
  },
  async created () {
    this.currentPage = this.route.params.page
    this.routeName = this.route.name
    this.routerNameClean = this.routeName.replace('-records', '')
    this.customEntity.set('name', this.routerNameClean)
    await this.customEntity.fetchByName()

    this.items = new this.$model.CustomEntityRecordMC.collection([], {}, this.routerNameClean)
    this.listTypeDetail = `${ this.routerNameClean }-record`
    this.listTypeNew = `${ this.routerNameClean }-record`
    this.model = new this.$model.CustomEntityRecordMC.model({}, null, {}, this.routerNameClean)
    this.modelPrefix = 'custom'
    this.modelDefaultProps = [
      'id',
      'created_at',
      'updated_at',
    ]
    this.setMCProps()
    this.fetchItems()
    this.$emitter.on('is-loading', isLoading => {
      this.isLoading = isLoading
    })
  },
  methods: {
    setMCProps () {
      for (let cef of this.customEntity.get('custom_entity_fields')) {
        let value = ''
        if (cef.type === 'list' || cef.type === 'entity' || cef.type === 'number')
          value = 0
        let fieldName = cef.name.replaceAll(' ', '_')
        if (cef.is_search) {
          this.modelKey = {
            letter: fieldName,
          }
          this.modelDefaultProps.splice(1, 0, fieldName)
        }
        this.model.addCustomProp(fieldName, value)
      }
    },
    async fetchItems () {
      try {
        this.isLoading = true
        this.items.set({
          'page_number': this.currentPage,
        })
        let data = await this.items.fetch()
        this.isLoading = false
        this.totalPages = data.getData().total_pages
        this.totalSkippedItems = data.getData().items_skipped
        this.totalItems = data.getData().total_items
        if (this.items.getModels().length)
          this.identifier = this.items.first().getOption('identifier')
        let models = this.items.getModels()
        this.items = new this.$model.CustomEntityRecordMC.collection([], {}, this.routerNameClean)
        for (let m of models)
          this.items.add(new this.$model.CustomEntityRecordMC.model(m._attributes, null, {}, this.routerNameClean))
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    navigationFirst () {
      this.currentPage = 1
      this.router.push({ name: this.routeName, params: { page: this.currentPage } })
    },
    navigationLast () {
      this.currentPage = this.totalPages
      this.router.push({ name: this.routeName, params: { page: this.currentPage } })
    },
    navigationBefore () {
      if (this.currentPage < 2)
        return

      this.currentPage--
      this.router.push({
        name: this.routeName,
        params: {
          page: this.currentPage,
        },
      })
    },
    navigationNext () {
      if (parseInt(this.currentPage) + 1 > this.totalPages)
        return

      this.currentPage++
      this.router.push({
        name: this.routeName,
        params: {
          page: this.currentPage,
        },
      })
    },
    showDetail (item) {
      this.router.push({
        name: this.listTypeDetail,
        params: {
          id: item.get(this.identifier),
        },
      })
    },
    openNew () {
      this.router.push({
        name: this.listTypeNew,
      })
    },
  },
}
</script>

<style scoped lang="css">

.data {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-font-size);
  font-weight: 500;
  margin: 4px;
  text-transform: uppercase;
}

#list-navigation {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

</style>
