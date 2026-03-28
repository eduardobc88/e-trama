<template lang="html">
  <div>
    <Widget
      sectionTitle="primary information"
      sectionDescription="basic data"
      v-bind:isLoading="isLoading">
      <Grid>
        <template #slota>
          <div class="form-wrapper">
            <InputText
              inputName="name"
              v-bind:inputValue="model.get('name')"
              v-bind:onChangeValue="onChangeInputValue"
              propName="name"
              v-bind:errorMessage="model.errors.name"
              helperMessage="at least 2 characters without spaces"/>
            <InputText
              inputName="description"
              v-bind:inputValue="model.get('description')"
              v-bind:onChangeValue="onChangeInputValue"
              propName="description"
              v-bind:errorMessage="model.errors.description"
              helperMessage="at least 2 characters without spaces"/>
            <FormDropdownSelect
              label="type"
              v-bind:initialIndexOption="model.getOption('type_index')"
              v-bind:onSelectOption="onDropdownSelect"
              v-bind:selectOptions="model.getTypes()"
              propName="type"
              v-bind:errorMessage="model.errors.type"
              helperMessage="select a type of data"/>
            <FormSearchDropdownSelect
              v-if="model.get('type') === 'entity'"
              title="entity"
              helpMsg="select a entity"
              v-bind:errorMsg="model.errors.custom_entity_id"
              v-bind:collection="customEntityCollection"
              v-bind:currentValue="model.get('custom_entity_id_ref')"
              v-bind:onSelectOption="onSelectOption"
              propName="custom_entity_id"
              propNameToShow="search_show"/>
            <FormSearchDropdownSelect
              v-if="model.get('type') === 'entity' && model.get('custom_entity_id')"
              title="entity field"
              helpMsg="select a entity field"
              v-bind:errorMsg="model.errors.custom_entity_field_id"
              v-bind:collection="customEntityFieldCollection"
              v-bind:currentValue="model.get('custom_entity_field_id_ref')"
              v-bind:onSelectOption="onSelectOption"
              propName="custom_entity_field_id"
              propNameToShow="search_show"
              searchFunctionName="searchField"/>
            <FormSearchDropdownSelect
              v-if="model.get('type') === 'list'"
              title="list"
              helpMsg="select a list"
              v-bind:errorMsg="model.errors.custom_list_id"
              v-bind:collection="customListCollection"
              v-bind:currentValue="model.get('custom_list_id_ref')"
              v-bind:onSelectOption="onSelectOption"
              propName="custom_list_id"
              propNameToShow="search_show"/>
          </div>
        </template>
      </Grid>
    </Widget>
    <FloatButtonOptions
      openIcon="add"
      closeIcon="close"
      v-bind:options="floatOptions"
      v-bind:expanded="true"/>
  </div>
</template>


<script>
import {
  useRouter,
  useRoute
} from 'vue-router'

import Widget from '../../component/widget.vue'
import InputText from '../../component/input-text.vue'
import Grid from '../../component/grid.vue'
import FormDropdownSelect from '../../component/form-dropdown-select.vue'
import FloatButtonOptions from '../../component/float-button-options.vue'
import FormSearchDropdownSelect from '../../component/form-search-dropdown-select.vue'

export default {
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      isNew: true,
      model: new this.$model.CustomFieldMC.model(),
      customEntityCollection: new this.$model.CustomEntityMC.collection(),
      customEntityFieldCollection: new this.$model.CustomEntityMC.collection(),
      customListCollection: new this.$model.CustomListMC.collection(),
      confirmationModalData: {
        modalTitle: 'do you want delete this model?',
        modalDescription: 'this action will delete this model',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      isLoading: false,
      floatOptions: [],
    }
  },
  components: {
    Widget,
    Grid,
    InputText,
    FloatButtonOptions,
    FormDropdownSelect,
    FormSearchDropdownSelect,
  },
  created () {
    let routeParamId = this.route.params.id
    if (routeParamId !== undefined && routeParamId !== '') {
      this.isNew = false
      this.model.set('id', routeParamId)
      this.getData()
    }
    this.generateFloatOptions()
  },
  methods: {
    generateFloatOptions () {
      this.floatOptions = [
        {
          icon: 'note_add',
          name: 'new',
          action: this.goToNew,
          hidden: true,
          show: !this.isNew,
        },
        {
          icon: 'save',
          name: 'save',
          action: this.validate,
          hidden: false,
          type: 'save',
          show: this.isNew,
        },
        {
          icon: 'save',
          name: 'update',
          action: this.validate,
          hidden: false,
          type: 'update',
          show: !this.isNew,
        },
        {
          icon: 'delete',
          name: 'delete',
          action: this.showConfirmationModal,
          hidden: false,
          type: 'delete',
          show: !this.isNew,
        },
        {
          icon: 'cancel',
          name: 'cancel',
          action: this.cancel,
          hidden: false,
          type: 'cancel',
          show: true,
        },
      ]
    },
    async getData () {
      this.isLoading = true
      try {
        await this.model.fetch()
        this.customEntityFieldCollection.set('custom_entity_id', this.model.get('custom_entity_id'))
        this.model.setOptionIndex('type')
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    onSelectOption (option, propName) {
      let object = {}
      if (option === null)
        return

      if (propName === 'custom_entity_id')
        this.customEntityFieldCollection.set('custom_entity_id', option.get('id'))
      object[propName] = option.get('id')
      object[`${ propName }_ref`] = option.get('search_show')
      this.model.set(object)
    },
    onDropdownSelect (option, index, data, propName) {
      this.model.setOption(`${ option.name }_index`, index)
      this.model.set(option.prop_name, option.name)
    },
    onChangeInputValue (propName, value) {
      this.model.set(propName, value)
    },
    onChangeCheckboxValue (propName, value, index) {
      this.model.set(propName, value)
    },
    showConfirmationModal () {
      this.$emitter.emit('confirmation-modal', this.confirmationModalData)
    },
    cancelAction () {
      this.$emitter.emit('confirmation-modal', null)
    },
    acceptAction () {
      this.$emitter.emit('confirmation-modal', null)
      this.delete()
    },
    goToNew () {
      let routeName = this.route.name
      this.router.push({
        name: routeName,
      })
    },
    cancel () {
      this.router.back()
    },
    async validate () {
      try {
        let isActiveRequest = this.model.getOption('isActiveRequest')
        if (isActiveRequest)
          return

        this.model.setOption('isActiveRequest', true)
        let errors = await this.model.validate()
        if (!_.isEmpty(errors)) {
          this.model.setOption('isActiveRequest', false)
          return
        }
        if (this.isNew) {
          this.save()
          return
        }
        this.update()
      } catch (err) {
        this.model.setOption('isActiveRequest', false)
        console.error(err)
      }
    },
    async save () {
      this.isLoading = true
      try {
        let routeName = this.route.name
        let data = await this.model.save()
        if (data.getData().status_code == 1)
          throw 'error on save'
        this.router.replace({
          name: routeName,
          params: {
            id: data.getData().data.id,
          },
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.model.setOption('isActiveRequest', false)
        this.isLoading = false
      }
    },
    async update () {
      this.isLoading = true
      try {
        await this.model.put()
      } catch (err) {
        console.error(err)
      } finally {
        this.model.setOption('isActiveRequest', false)
        this.isLoading = false
      }
    },
    async delete () {
      this.isLoading = true
      try {
        let routeName = this.route.name
        let data = await this.model.delete()
        if (data.getData().status_code == 1)
          throw 'error on save'
        this.router.replace({
          name: `${ routeName }s`,
          params: {
            page: 1,
          }
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.model.setOption('isActiveRequest', false)
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped lang="css">

</style>
