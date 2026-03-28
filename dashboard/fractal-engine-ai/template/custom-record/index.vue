<template lang="html">
  <div>
    <div
      id="header-info">
      <Grid>
        <template #slota>
          <div>
            <div
              class="info">
              <p>
                {{ $t('id') }}:
              </p>
              <p>
                {{ model.get('id') }}
              </p>
            </div>
            <div
                class="info">
              <p>
                {{ $t('created by') }}:
              </p>
              <p>
                {{ model.get('created_user_id_ref') }}
              </p>
            </div>
            <div
                class="info">
              <p>
                {{ $t('created at') }}:
              </p>
              <p>
                {{ model.get('created_at') }}
              </p>
            </div>
          </div>
        </template>
        <template #slotb>
          <div>
            <div
              class="info">
              <p>
                {{ $t('updated by') }}:
              </p>
              <p>
                {{ model.get('updated_user_id_ref') }}
              </p>
            </div>
            <div
                class="info">
              <p>
                {{ $t('updated at') }}:
              </p>
              <p>
                {{ model.get('updated_at') }}
              </p>
            </div>
          </div>
        </template>
        <template #slotc>

        </template>
      </Grid>
    </div>
    <div
      id="content">
      <div
        class="wrapper-column-content">
        <Widget
          sectionTitle="primary information"
          sectionDescription="basic data"
          v-bind:isLoading="isLoading"
          width="100%">
          <Grid>
            <template #slota>
              <div>
                <template v-for="(value, key) of model._attributes">
                  <FormSearchDropdownSelect
                    v-if="getFieldType(key) === 'entity'"
                    v-bind:title="key.replaceAll('_', ' ')"
                    v-bind:helpMsg="`select ${ key }`"
                    v-bind:errorMsg="model.errors[key]"
                    v-bind:collection="model.getOption(`${ key }_collection`)"
                    v-bind:currentValue="model.get(`${ key }_id_ref`)"
                    v-bind:onSelectOption="onSelectFormSearchDropdownSelect"
                    v-bind:propName="key"
                    v-bind:searchInCustomEntity="key"
                    searchFunctionName="searchInCustomEntityRecord"
                    propNameToShow="search_show"/>
                  <FormDropdownSelect
                    v-if="getFieldType(key) === 'list'"
                    v-bind:label="key.replaceAll('_', ' ')"
                    v-bind:helperMessage="`select ${ key }`"
                    v-bind:selectOptions="model.getOption(`${ key }_options`)"
                    v-bind:onSelectOption="onSelectFormDropdownSelect"
                    v-bind:initialIndexOption="model.getOption(`${ key }_index`)"
                    v-bind:errorMessage="model.errors[key]"
                    v-bind:propName="key"/>
                  <DatePicker
                    v-if="getFieldType(key) === 'date'"
                    v-bind:inputName="key.replaceAll('_', ' ')"
                    v-bind:doneAction="onSelectDatePicker"
                    v-bind:date="model.get(key)"
                    v-bind:data="key"
                    helperMessage="select date"
                    v-bind:isTop="false"/>
                  <InputText
                    v-if="getFieldType(key) === 'text'"
                    v-bind:inputName="key.replaceAll('_', ' ')"
                    v-bind:inputValue="model.get(key)"
                    v-bind:onChangeValue="onChangeInputTextValue"
                    v-bind:propName="key"
                    v-bind:errorMessage="model.errors[key]"
                    helperMessage="..."/>
                  <InputTextarea
                    v-if="getFieldType(key) === 'textarea'"
                    v-bind:inputName="key.replaceAll('_', ' ')"
                    v-bind:inputValue="model.get(key)"
                    v-bind:onChangeValue="onChangeInputTextValue"
                    v-bind:propName="key"
                    v-bind:errorMessage="model.errors[key]"
                    helperMessage="..."/>
                  <InputText
                    v-if="getFieldType(key) === 'number'"
                    inputType="number"
                    v-bind:inputName="key.replaceAll('_', ' ')"
                    v-bind:inputValue="model.get(key)"
                    v-bind:onChangeValue="onChangeInputTextValue"
                    v-bind:propName="key"
                    v-bind:errorMessage="model.errors[key]"
                    helperMessage="..."/>
                  <Checkbox
                    v-if="getFieldType(key) === 'checkbox'"
                    v-bind:label="key.replaceAll('_', ' ')"
                    v-bind:onChangeValue="onChangeCheckboxValue"
                    v-bind:propName="key"
                    v-bind:item="model"
                    v-bind:isAlignLeft="true"
                    v-bind:currentValue="!!model.get(key)"/>
                  <InputFile
                    v-if="getFieldType(key) === 'file'"
                    maxItems="1"
                    v-bind:multipleFiles="false"
                    v-bind:propName="key"
                    v-bind:title="key.replaceAll('_', ' ')"
                    v-bind:areaName="areaName"
                    v-bind:customEntityRecordId="customEntityRecordId"
                    v-bind:errorMessage="model.errors[key]"
                    v-bind:isCustomEntityAttachment="true"
                    v-bind:model="model"
                    v-bind:onlyImages="false"
                    v-bind:rowEmbeded="false"
                    v-bind:show="true"
                    v-bind:showTypes="false"
                    v-bind:types="[]"
                    helperMessage="click on + button to open modal file"
                    description="select a file"/>
                </template>
              </div>
            </template>
          </Grid>
        </Widget>
        <Widget
          sectionTitle="information fields"
          sectionDescription="show information about fields"
          v-bind:isLoading="isLoading"
          width="100%">
          <Grid>
            <template #slota>
              <template
                v-if="model !== undefined && Object.keys(model.errors).length">
                <div
                  id="errors-modal">
                  <div
                    id="errors">
                    {{ model.errors.length }}
                    <template
                      v-for="(error, key) of model.errors">
                      <div
                        v-if="error !== ''"
                        class="info">
                        <p>
                          {{ key.replaceAll('_', ' ') }}:
                        </p>
                        <p>
                          {{ error }}
                        </p>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </template>
          </Grid>
        </Widget>
      </div>
      <div
        class="wrapper-column-content">
        <Widget
          sectionTitle="document attachments"
          sectionDescription="show document attachments"
          v-bind:isLoading="isLoading"
          width="100%">
          <Grid>
            <template #slota>
              <InputFile
                maxItems="10"
                propName="attachment_files"
                title="files"
                v-bind:multipleFiles="true"
                v-bind:areaName="areaName"
                v-bind:customEntityRecordId="customEntityRecordId"
                v-bind:errorMessage="model.errors.attachment_files"
                v-bind:isCustomEntityAttachment="true"
                v-bind:model="model"
                v-bind:onlyImages="false"
                v-bind:rowEmbeded="true"
                v-bind:show="true"
                v-bind:showTypes="false"
                v-bind:types="[]"
                helperMessage="click on + button to open modal file"
                description="select a file"/>
            </template>
          </Grid>
        </Widget>
      </div>
    </div>
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

import Grid from '../../component/grid.vue'
import Button from '../../component/button.vue'
import ButtonIcon from '../../component/button-icon.vue'
import InputText from '../../component/input-text.vue'
import Widget from '../../component/widget.vue'
import InputTextarea from '../../component/input-textarea.vue'
import FloatButtonOptions from '../../component/float-button-options.vue'
import FormSearchDropdownSelect from '../../component/form-search-dropdown-select.vue'
import InputFile from '../../component/input-file.vue'
import FormDropdownSelect from '../../component/form-dropdown-select.vue'
import Checkbox from '../../component/checkbox.vue'
import DatePicker from '../../component/date-picker.vue'

export default {
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      isNew: true,
      customEntity: new this.$model.CustomEntityMC.model(),
      model: null,
      confirmationModalData: {
        modalTitle: 'do you want delete this record?',
        modalDescription: 'this action will delete this record',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      isLoading: false,
      floatOptions: [],

      customEntityRecordId: '',
    }
  },
  components: {
    Button,
    ButtonIcon,
    Checkbox,
    DatePicker,
    FloatButtonOptions,
    FormDropdownSelect,
    FormSearchDropdownSelect,
    Grid,
    InputFile,
    InputText,
    InputTextarea,
    Widget,
  },
  async created () {
    this.routeName = this.route.name
    let routeParamId = this.route.params.id
    let routerNameClean = this.routeName.replace('-record', '')
    this.customEntity.set('name', routerNameClean)
    this.areaName = routerNameClean
    this.model = new this.$model.CustomEntityRecordMC.model({}, null, {}, routerNameClean)
    if (routeParamId !== undefined && routeParamId !== '') {
      this.isNew = false
      this.model.set('id', routeParamId)
      this.customEntityRecordId = routeParamId
    }
    this.setup()
  },
  mounted () {
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
    async setup () {
      this.isLoading = true
      try {
        await this.customEntity.fetchByName()
        if (!this.isNew) {
          await this.model.fetch()
          this.model.sync()
        } else
          this.setModelDefaultProps()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    // NOTE: START CUSTOM FORM
    onInputFile (file, propName) {
      let id = file.get('id')
      this.model.set(propName, id)
    },
    setModelDefaultProps () {
      for (let cef of this.customEntity.get('custom_entity_fields')) {
        let nameField = cef.name.replaceAll(' ', '_')
        let value = this.getType(cef.type)
        this.model.addCustomProp(nameField, value)
      }
      this.model.set('uuid', this.$uuid.v1())
    },
    getType (customFieldType) {
      let type = ''
      switch (customFieldType) {
        case 'file':
          type = 0
          break
        case 'text':
          type = ''
          break
        case 'textarea':
          type = ''
          break
        case 'number':
          type = 0
          break
        case 'checkbox':
          type = 0
          break
        case 'date':
          type = ''
          break
        case 'list':
          type = ''
          break
        case 'entity':
          type = 0
          break
      }
      return type
    },
    async setupEntity (entity, currentValue) {
      let fieldName = entity.name.replaceAll(' ', '_')
      let isCollection = this.model.getOption(`${ fieldName }_collection_ok`)
      if (isCollection !== null)
        return

      let collection = new this.$model.CustomEntityMC.collection([], {}, entity.custom_entity_name)
      this.model.setOption(`${ fieldName }_collection_ok`, true)
      this.model.setOption(`${ fieldName }_collection`, collection)
      this.model.set('uuid', this.$uuid.v1())
    },
    async setupList (list, currentValue) {
      let listName = list.name.replaceAll(' ', '_')
      let isOptions = this.model.getOption(`${ listName }_options_ok`)
      let options = []
      let optionIndex = -1
      if (isOptions !== null)
        return

      this.model.setOption(`${ listName }_options_ok`, true)
      this.model.setOption(`${ listName }_options`, options)
      this.model.setOption(`${ listName }_index`, optionIndex)
      let customList = new this.$model.CustomListMC.model()
      customList.set('id', list.custom_list_id)
      try {
        await customList.fetch()
        let data = customList.get('data')
        for (let index in data) {
          let clv = data[index]
          if (clv.value === currentValue)
            optionIndex = index
          options.push({
            name: clv.value,
          })
        }
        this.model.setOption(`${ listName }_options`, options)
        this.model.setOption(`${ listName }_index`, optionIndex)
      } catch (err) {
        console.error(err)
      } finally {
        this.model.set('uuid', this.$uuid.v1())
      }
    },
    getFieldType (name) {
      let type = 'info'
      let nameField = name.replaceAll('_', ' ')
      for (let cef of this.customEntity.get('custom_entity_fields'))
        if (cef.name === nameField) {
          type = cef.type
          if (type === 'list')
            this.setupList(cef, this.model.get(name))
          else if (type === 'entity')
            this.setupEntity(cef, this.model.get(name))
          break
        }
      return type
    },
    onSelectFormSearchDropdownSelect (option, propName) {
      let object = {}
      if (option === null)
        return

      object[propName] = option.get('id')
      object[`${ propName }_id_ref`] = option.get('search_show')
      this.model.set(object)
    },
    onSelectFormDropdownSelect (option, index, data, propName) {
      this.model.set(propName, option.name)
      this.model.setOption(`${ propName }_index`, index)
      this.model.set('uuid', this.$uuid.v1())
    },
    onSelectDatePicker (date, propName) {
      this.model.set(propName, date)
      this.model.set('uuid', this.$uuid.v1())
    },
    onChangeInputTextValue (propName, value) {
      this.model.set(propName, value)
      this.model.set('uuid', this.$uuid.v1())
    },
    onChangeCheckboxValue (propName, value, index) {
      this.model.set(propName, value)
      this.model.set('uuid', this.$uuid.v1())
    },
    // NOTE: END CUSTOM FORM
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
        this.isLoading = false
        this.model.setOption('isActiveRequest', false)
      }
    },
    async delete () {
      this.isLoading = true
      try {
        let routeName = this.route.name
        let data = await this.model.delete()
        if (data.getData().status_code == 1)
          throw 'error on delete'
        this.router.replace({
          name: `${ routeName }s`,
          params: {
            page: 1,
          },
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.model.setOption('isActiveRequest', false)
      }
    },
    async update () {
      this.isLoading = true
      try {
        await this.model.put()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.model.setOption('isActiveRequest', false)
      }
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
  },
}
</script>

<style scoped lang="css">

#header-info {
  background-color: var(--main-hover-color);
  border-radius: 10px;
  margin: 0 0 24px 0;
  padding: 10px;
}

#content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

#content > .wrapper-column-content > div {
  margin: 24px 0;
}

.info {
  display: flex;
  margin: 0;
}

.info > p {
  margin: 4px 5px;
}

.info > p:first-child {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  text-transform: uppercase;
}

.info > p:last-child {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
}

#related-records {
  display: flex;
  flex-direction: column;
}

.related-record {
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  margin: 0;
  max-width: 100%;
  padding: 0 6px;
  position: relative;
  flex-direction: column;
}

.related-record .info {
  display: flex;
  padding: 4px 0;
  text-transform: uppercase;
  width: calc(100% - 50px);
}

.related-record .name {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-accent-font-size);
  line-height: 1;
  margin: 0 0 0 8px;
  max-width: 480px;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
}

.related-record:hover {
  background-color: var(--main-hover-color);
}

.related-record:active {
  background-color: var(--main-active-color);
}

.related-record .thumbnail {
  align-self: center;
  border-radius: 10px;
  display: flex;
  flex-shrink: 0;
  height: 24px;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 24px;
}

.related-record .letter {
  align-self: center;
  color: var(--main-body-bg-color);
  display: flex;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  margin: auto;
  margin: auto;
  position: absolute;
  text-transform: capitalize;
}

.related-record .button-action {
  margin: 4px;
  max-height: 24px;
  position: absolute !important;
  right: 6px;
  z-index: 2;
  top: 0;
  bottom: 0;
}


@media screen and (max-width: 992px) {
  #content {
    grid-template-columns: 1fr;
  }
}
</style>
