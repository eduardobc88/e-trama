<template lang="html">
  <div>
    <Grid>
      <template #slota>
        <Widget
          sectionTitle="primary information"
          sectionDescription="basic data"
          v-bind:isLoading="isLoading"
          width="100%">
          <div class="form-wrapper">
            <InputText
              inputName="name"
              v-bind:inputValue="model.get('name')"
              v-bind:onChangeValue="onChangeInputValue"
              propName="name"
              v-bind:errorMessage="model.errors.name"
              helperMessage="at least 2 characters without spaces"/>
            <InputText
              disabled="true"
              inputName="resource name"
              v-bind:inputValue="model.get('resource_name')"
              helperMessage="the resource name for permissions and api access"/>
            <InputTextarea
              inputName="description"
              v-bind:inputValue="model.get('description')"
              v-bind:onChangeValue="onChangeInputValue"
              propName="description"
              v-bind:errorMessage="model.errors.description"
              helperMessage="at least 2 characters"/>
            <InputText
              inputName="prefix"
              v-bind:inputValue="model.prefix"
              v-bind:onChangeValue="onChangeInputValue"
              propName="prefix"
              v-bind:errorMessage="model.errors.prefix"
              helperMessage="without spaces or special characters"/>
            <InputText
              inputName="suffix"
              v-bind:inputValue="model.suffix"
              v-bind:onChangeValue="onChangeInputValue"
              propName="suffix"
              v-bind:errorMessage="model.errors.suffix"
              helperMessage="without spaces or special characters or empty"/>
            <InputText
              inputName="number"
              v-bind:inputValue="model.number"
              v-bind:onChangeValue="onChangeInputValue"
              propName="number"
              type="number"
              v-bind:errorMessage="model.errors.number"
              helperMessage="set the number where auto increment starts"/>
             <div
              class="data">
              folio (example): {{ `${ model.get('prefix') }${ model.get('suffix') }/${ model.get('number') }-${ new Date().getFullYear() }` }}
            </div>
          </div>
        </Widget>
      </template>
      <template #slotb>
        <Widget
          sectionTitle="custom fields"
          sectionDescription="select the custom fields for this custom entity"
          v-bind:isLoading="isLoading"
          width="100%">
          <div id="custom-fields">
            <template
              v-for="(item, key) of customEntityFields">
              <div
                class="custom-entity-field">
                <Checkbox
                  :key="`${ key }${ item.id }${ item.active }`"
                  v-bind:label="item.name"
                  v-bind:onChangeValue="onChangeCheckbox"
                  propName="custom_field"
                  v-bind:item="key"
                  v-bind:isAlignLeft="true"
                  v-bind:currentValue="!!item.active"/>
                <div
                  class="data">
                  {{ item.type }}
                </div>
                <Checkbox
                  v-if="item.type !== 'checkbox'"
                  :key="`${ key }${ item.id }_unique_${ item.is_unique }`"
                  label="unique"
                  v-bind:onChangeValue="onChangeCheckbox"
                  propName="is_unique"
                  v-bind:item="key"
                  v-bind:isAlignLeft="true"
                  v-bind:currentValue="!!item.is_unique"/>
                <Checkbox
                  v-if="item.type !== 'checkbox' && item.type !== 'entity'"
                  :key="`${ key }${ item.id }_search_${ item.is_search }`"
                  label="search"
                  v-bind:onChangeValue="onChangeCheckbox"
                  propName="is_search"
                  v-bind:item="key"
                  v-bind:isAlignLeft="true"
                  v-bind:currentValue="!!item.is_search"/>
              </div>
            </template>
          </div>
        </Widget>
      </template>
      <template #slotc>
        <Widget
          sectionTitle="permissions"
          sectionDescription="select permissions for each role"
          v-bind:isLoading="isLoading"
          width="100%">
          <div id="custom-fields">
            <div
              class="header">
              <div>
                {{ $t('resource') }}
              </div>
              <div>
                {{ $t('create') }}
              </div>
              <div>
                {{ $t('read') }}
              </div>
              <div>
                {{ $t('update') }}
              </div>
              <div>
                {{ $t('delete') }}
              </div>
              <div>
                {{ $t('view') }}
              </div>
            </div>
            <template
              v-for="(item, key) of customEntityRolePermissions">
              <div
                class="row">
                <div>
                  {{ item.role_name }}
                </div>
                <div>
                  <Checkbox
                    isEmbeded="true"
                    v-bind:onChangeValue="onChangeCheckbox"
                    v-bind:item="{
                      index: key,
                      value: 'c',
                    }"
                    propName="permission"
                    v-bind:currentValue="item.permission.includes('c')"/>
                </div>
                <div>
                  <Checkbox
                    isEmbeded="true"
                    v-bind:onChangeValue="onChangeCheckbox"
                    v-bind:item="{
                      index: key,
                      value: 'r',
                    }"
                    propName="permission"
                    v-bind:currentValue="item.permission.includes('r')"/>
                </div>
                <div>
                  <Checkbox
                    isEmbeded="true"
                    v-bind:onChangeValue="onChangeCheckbox"
                    v-bind:item="{
                      index: key,
                      value: 'u',
                    }"
                    propName="permission"
                    v-bind:currentValue="item.permission.includes('u')"/>
                </div>
                <div>
                  <Checkbox
                    isEmbeded="true"
                    v-bind:onChangeValue="onChangeCheckbox"
                    v-bind:item="{
                      index: key,
                      value: 'd',
                    }"
                    propName="permission"
                    v-bind:currentValue="item.permission.includes('d')"/>
                </div>
                <div>
                  <Checkbox
                    isEmbeded="true"
                    v-bind:onChangeValue="onChangeCheckbox"
                    v-bind:item="{
                      index: key,
                      value: 'v',
                    }"
                    propName="permission"
                    v-bind:currentValue="item.permission.includes('v')"/>
                </div>
              </div>
            </template>
          </div>
        </Widget>
      </template>
    </Grid>
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
import InputText from '../../component/input-text.vue'
import Widget from '../../component/widget.vue'
import InputTextarea from '../../component/input-textarea.vue'
import FloatButtonOptions from '../../component/float-button-options.vue'
import Checkbox from '../../component/checkbox.vue'

export default {
  components: {
    Button,
    Checkbox,
    FloatButtonOptions,
    Grid,
    InputText,
    InputTextarea,
    Widget,
  },
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      isNew: true,
      model: new this.$model.CustomEntityMC.model(),
      customFieldCollection: new this.$model.CustomFieldMC.collection(),
      roleCollection: new this.$model.RoleMC.collection(),
      confirmationModalData: {
        modalTitle: 'do you want delete this model?',
        modalDescription: 'this action will delete this model',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      isLoading: false,
      floatOptions: [],
      customEntityFields: [],
      customEntityRolePermissions: [],
    }
  },
  created () {
    let routeParamId = this.route.params.id
    if (routeParamId !== undefined && routeParamId !== '') {
      this.isNew = false
      this.model.set('id', routeParamId)
      this.getData()
      this.createModelEventListener()
    } else
      this.setup()
    this.generateFloatOptions()
  },
  beforeDestroy () {
    this.removeModelEventListener()
  },
  methods: {
    createModelEventListener () {
      this.model.on('notification', event => {
        let isActiveRequest = this.model.getOption('isActiveRequest')
        if (isActiveRequest && event.method !== 'put')
          return

        this.generateCustomEntityFields()
        this.generateCustomEntityRolePermission()
      })
    },
    removeModelEventListener () {
      this.model.off('notification')
    },
    async setup () {
      try {
        this.customFieldCollection.set('page_number', 1)
        this.roleCollection.set('page_number', 1)
        await this.customFieldCollection.fetch()
        await this.roleCollection.fetch()
        this.generateCustomEntityFields()
        this.generateCustomEntityRolePermission()
      } catch (err) {
        console.error(err)
      } finally {

      }
    },
    async getData () {
      this.isLoading = true
      try {
        await this.model.fetch()
        this.setup()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    generateCustomEntityRolePermission () {
      let rolePermission = []
      let currentPermissions = this.model.get('custom_entity_role_permissions')
      let customEntityResourceId = this.model.get('resource_id')
      for (let r of this.roleCollection.getModels()) {
        let roleData = {
          id: 0,
          role_name: r.get('role_name'),
          role_id: r.get('id'),
          resource_id: customEntityResourceId,
          permission: '', // NOTE: C,R,U,D,V
        }
        for (let cr of currentPermissions)
          if (cr.role_id === roleData.role_id) {
            roleData.id = cr.id
            roleData.resource_id = customEntityResourceId
            roleData.permission = cr.permission
            break
          }
        rolePermission.push(roleData)
      }
      this.customEntityRolePermissions = rolePermission
      this.model.set('custom_entity_role_permissions', this.customEntityRolePermissions)
    },
    generateCustomEntityFields () {
      let customEntityField = this.model.get('custom_entity_fields')
      let exist = false
      let active = false
      for (let cf of this.customFieldCollection.getModels()) {
        active = false
        exist = false
        for (let cef of customEntityField)
          if (cf.get('id') === cef.custom_field_id) {
            exist = true
            active = !!cef.active
            break
          }
        if (!exist) {
          customEntityField.push({
            id: 0,
            name: cf.get('name'),
            type: cf.get('type'),
            custom_entity_id: this.model.get('id'),
            custom_field_id: cf.id,
            active: active,
          })
        }
      }
      this.model.set('custom_entity_fields', [])
      this.model.set('custom_entity_fields', customEntityField)
      this.model.sync()
      this.customEntityFields = customEntityField
    },
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
    onChangeInputValue (propName, value) {
      this.model.set(propName, value)
      if (propName === 'name')
        this.model.set('resource_name', value.replaceAll(' ', '-'))
    },
    onChangeCheckbox (propName, value, index) {
      if (propName === 'permission') {
        let permission = this.customEntityRolePermissions[index.index].permission
        if (permission === '')
          permission = []
        else
          permission = this.customEntityRolePermissions[index.index].permission.split(',')
        let position = permission.indexOf(index.value)
        if (position >= 0)
          permission.splice(position, 1)
        else
          permission.push(index.value)
        this.customEntityRolePermissions[index.index].permission = permission.toString()
        this.model.set('custom_entity_role_permissions', this.customEntityRolePermissions)
      } else if (propName === 'custom_field') {
        this.customEntityFields[index].active = value
        this.model.set('custom_entity_fields', this.customEntityFields)
      } else if (propName === 'is_unique') {
        this.customEntityFields[index].is_unique = value
        this.model.set('custom_entity_fields', this.customEntityFields)
      } else if (propName === 'is_search') {
        this.customEntityFields[index].is_search = value
        this.model.set('custom_entity_fields', this.customEntityFields)
      }
    },
    onSelectOption (data, index) {
      this.model.set(data.prop_name, data.value)
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

#custom-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header,
.row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
}

.header {
  font-size: var(--main-accent-font-size);
  color: var(--main-text-color);
  font-weight: 600;
  margin: 2px 6px;
  text-transform: uppercase;
}

.row {
  text-transform: uppercase;
  font-size: var(--main-accent-font-size);
  color: var(--main-text-color);
}

.data {
  text-transform: uppercase;
  font-size: var(--main-accent-font-size);
  color: var(--main-text-color);
  align-self: center;
}

.custom-entity-field {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 6px;
}

</style>
