<template>
  <div>
    <Grid>
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
          v-bind:isLoading="isLoading"
          v-bind:model="model"
          v-bind:modelPrefix="modelPrefix"
          v-bind:modelDefaultProps="modelDefaultProps"
          v-bind:identifier="identifier"
          v-bind:onlyWrapper="true"
          v-bind:isOverBody="true"
          v-bind:keyThumbnail="keyThumbnail"/>
        <div id="list-navigation">
          <div
            class="data">
            {{ $t('rows from') }} {{ totalSkippedItems + 1 }} {{ $t('to') }}
            {{ totalSkippedItems + items.models.length }} {{ $t('of') }} {{ totalItems }}
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
      modelKey: {},
      model: null,
      modelPrefix: '',
      modelDefaultProps: [],
      keyThumbnail: '',
    }
  },
  components: {
    ButtonIcon,
    FloatButtonIcon,
    Grid,
    ListTable,
  },
  created () {
    this.currentPage = parseInt(this.route.params.page)
    this.routeName = this.route.name
    switch (this.routeName) {
      case 'file-records':
        this.items = new this.$model.FileMC.collection()
        this.listTypeDetail = 'file-record'
        this.listTypeNew = 'file-record'
        this.model = new this.$model.FileMC.model()
        this.modelPrefix = 'file'
        this.modelDefaultProps = [
          'id',
          'file_title',
          'file_name',
          'file_description',
          'file_mime_type',
        ]
        this.keyThumbnail = 'id'
        this.modelKey = {
          letter: 'file_name',
        }
        break
      case 'language-records':
        this.items = new this.$model.LanguageMC.collection()
        this.listTypeDetail = 'language-record'
        this.listTypeNew = 'language-record'
        this.model = new this.$model.LanguageMC.model()
        this.modelPrefix = 'language'
        this.modelDefaultProps = [
          'id',
          'language_name',
          'created_at',
        ]
        this.modelKey = {
          letter: 'language_name',
        }
        break
      case 'resource-records':
        this.items = new this.$model.ResourceMC.collection()
        this.listTypeDetail = 'resource-record'
        this.listTypeNew = 'resource-record'
        this.model = new this.$model.ResourceMC.model()
        this.modelPrefix = 'resource'
        this.modelDefaultProps = [
          'id',
          'name',
          'description',
          'type',
          'path',
          'created_at',
        ]
        this.modelKey = {
          letter: 'name',
        }
        break
      case 'role-records':
        this.items = new this.$model.RoleMC.collection()
        this.listTypeDetail = 'role-record'
        this.listTypeNew = 'role-record'
        this.model = new this.$model.RoleMC.model()
        this.modelPrefix = 'role'
        this.modelDefaultProps = [
          'id',
          'role_name',
          'created_at',
        ]
        this.modelKey = {
          letter: 'role_name',
        }
        break
      case 'user-records':
        this.items = new this.$model.UserMC.collection()
        this.listTypeDetail = 'user-record'
        this.listTypeNew = 'user-record'
        this.model = new this.$model.UserMC.model()
        this.modelPrefix = 'user'
        this.modelDefaultProps = [
          'id',
          'user_name',
          'user_first_name',
          'user_status',
          'user_active',
          'area_id',
          'created_at',
        ]
        this.keyThumbnail = 'profile_file_id'
        this.modelKey = {
          letter: 'user_name',
        }
        break
      case 'feedback-records':
        this.items = new this.$model.FeedbackMC.collection()
        this.listTypeDetail = 'feedback-record'
        this.listTypeNew = 'feedback-record'
        this.model = new this.$model.FeedbackMC.model()
        this.modelPrefix = 'feedback'
        this.modelDefaultProps = [
          'id',
          'feedback_title',
          'feedback_description',
          'user_id',
          'user_id_ref',
          'created_at',
        ]
        this.modelKey = {
          letter: 'feedback_title',
        }
        break
      case 'category-records':
        this.items = new this.$model.CategoryMC.collection()
        this.listTypeDetail = 'category-record'
        this.listTypeNew = 'category-record'
        this.model = new this.$model.CategoryMC.model()
        this.modelPrefix = ''
        this.modelDefaultProps = [
          'id',
          'name',
          'description',
          'created_at',
        ]
        this.modelKey = {
          letter: 'name',
        }
        break
      case 'post-records':
        this.items = new this.$model.PostMC.collection()
        this.listTypeDetail = 'post-record'
        this.listTypeNew = 'post-record'
        this.model = new this.$model.PostMC.model()
        this.modelPrefix = ''
        this.modelDefaultProps = [
          'id',
          'title',
          'excerpt',
          'created_at',
        ]
        this.modelKey = {
          id: 'file_id',
          letter: 'title',
        }
        break
      case 'faq-records':
        this.items = new this.$model.FAQMC.collection()
        this.listTypeDetail = 'faq-record'
        this.listTypeNew = 'faq-record'
        this.model = new this.$model.FAQMC.model()
        this.modelPrefix = ''
        this.modelDefaultProps = [
          'id',
          'title',
          'content',
          'created_at',
        ]
        this.modelKey = {
          letter: 'title',
        }
        break
      case 'custom-entity-records':
        this.items = new this.$model.CustomEntityMC.collection()
        this.listTypeDetail = 'custom-entity-record'
        this.listTypeNew = 'custom-entity-record'
        this.model = new this.$model.CustomEntityMC.model()
        this.modelPrefix = ''
        this.modelDefaultProps = [
          'id',
          'name',
          'description',
          'created_at',
          ]
        this.modelKey = {
          letter: 'name',
        }
        break
      case 'custom-list-records':
        this.items = new this.$model.CustomListMC.collection()
        this.listTypeDetail = 'custom-list-record'
        this.listTypeNew = 'custom-list-record'
        this.model = new this.$model.CustomListMC.model()
        this.modelPrefix = ''
        this.modelDefaultProps = [
          'id',
          'name',
          'description',
          'created_at',
          ]
        this.modelKey = {
          letter: 'name',
        }
        break
      case 'custom-field-records':
        this.items = new this.$model.CustomFieldMC.collection()
        this.listTypeDetail = 'custom-field-record'
        this.listTypeNew = 'custom-field-record'
        this.model = new this.$model.CustomFieldMC.model()
        this.modelPrefix = ''
        this.modelDefaultProps = [
          'id',
          'name',
          'description',
          'created_at',
          ]
        this.modelKey = {
          letter: 'name',
        }
        break
      case 'area-records':
        this.items = new this.$model.AreaMC.collection()
        this.listTypeDetail = 'area-record'
        this.listTypeNew = 'area-record'
        this.model = new this.$model.AreaMC.model()
        this.modelPrefix = ''
        this.modelDefaultProps = [
          'id',
          'name',
          'description',
          'created_at',
          ]
        this.modelKey = {
          letter: 'name',
        }
        break
    }
    this.fetchItems()
    this.$emitter.on('is-loading', isLoading => {
      this.isLoading = isLoading
    })
  },
  methods: {
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
