<template lang="html">
  <div>
    <Widget
      sectionTitle="primary information"
      sectionDescription="basic data"
      v-bind:isLoading="isLoading"
      width="100%">
      <Grid>
        <template #slota>
          <div>
            <div class="content-wrapper">
              <InputText
                inputName="name"
                v-bind:inputValue="model.get('role_name')"
                v-bind:onChangeValue="onChangeInputValue"
                propName="role_name"
                v-bind:errorMessage="model.errors.role_name"
                helperMessage="at least 2 characters">
              </InputText>
              <div id="doubleBoxWrapper">
                <div id="leftBox">
                  <p class="sub-title">
                    {{ $t('resources') }} - {{ resourceOptions.length }}
                  </p>
                  <perfect-scrollbar>
                    <div class="boxlist-wrapper">
                      <ButtonDoubleAction
                        v-for="(resourceOption, index) of resourceOptions"
                        buttonIcon="add"
                        v-bind:buttonTextAction="addToRoleResources"
                        v-bind:buttonIconAction="addToRoleResources"
                        v-bind:data="index"
                        :key="$uuid.v1()">
                        {{ resourceOption.name }}
                      </ButtonDoubleAction>
                    </div>
                  </perfect-scrollbar>
                </div>
                <div id="rightBox">
                  <p class="sub-title">
                    {{ $t('current resources') }} - {{ model.get('role_resources').length }}
                  </p>
                  <perfect-scrollbar>
                    <div class="boxlist-wrapper">
                      <template v-for="(resource, index) of model.get('role_resources')">
                        <ButtonDoubleAction
                          buttonIcon="remove"
                          v-if="!resource.removed"
                          v-bind:buttonTextAction="openPermissionsModal"
                          v-bind:buttonIconAction="addToResources"
                          v-bind:data="index"
                          :key="$uuid.v1()">
                          {{ resource.name }}
                          <label class="item-permissions">
                            {{ resource.permission }}
                          </label>
                        </ButtonDoubleAction>
                      </template>
                    </div>
                  </perfect-scrollbar>
                </div>
              </div>
            </div>
            <FloatButtonOptions
              v-if="!isNew"
              openIcon="add"
              closeIcon="close"
              v-bind:options="floatOptions"/>
          </div>
        </template>
      </Grid>
    </Widget>
    <FloatButtonOptions
      openIcon="add"
      closeIcon="close"
      v-bind:options="floatOptions"
      v-bind:expanded="true"/>
    <ModalPermissions
      v-if="modalPermissionsIsVisible"
      v-bind:modalTitle="modalPermissionsTitle"
      v-bind:modalDescription="modalPermissionsDescription"
      v-bind:cancelAction="modalPermissionsClose"
      v-bind:acceptAction="modalPermissionsAccept"
      v-bind:checkboxNames="modalPermissionsCheckboxNames"/>
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
import ButtonDoubleAction from '../../component/button-double-action.vue'
import ModalPermissions from '../../component/modal-permissions.vue'
import FloatButtonOptions from '../../component/float-button-options.vue'

export default {
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      isNew: true,
      model: new this.$model.RoleMC.model(),
      resourcesCollection: new this.$model.ResourceMC.collection(),
      resourceOptions: [],
      isLoading: false,
      modalPermissionsIsVisible: false,
      modalPermissionsTitle: '',
      modalPermissionsDescription: 'chose permissions for this resource',
      modalPermissionsCheckboxNames: [],
      currentResourceModalIndex: null,
      confirmationModalData: {
        modalTitle: 'do you want delete this role?',
        modalDescription: 'this action will delete this role',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      floatOptions: [],
    }
  },
  components: {
    Widget,
    Button,
    InputText,
    Grid,
    ButtonDoubleAction,
    ModalPermissions,
    FloatButtonOptions,
  },
  created() {
    let routeParamId = this.route.params.id
    if (routeParamId !== undefined && routeParamId.toString().length) {
      this.isNew = false
      this.model.set('id', routeParamId)
      this.getData()
      this.createModelEventListener()
    } else
      this.getResources()
    this.generateFloatOptions()
  },
  beforeDestroy () {
    this.removeModelEventListener()
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
    createModelEventListener () {
      this.model.on('notification', event => {
        let isActiveRequest = this.model.getOption('isActiveRequest')
        if (isActiveRequest && event.method !== 'put')
          return

        this.setup()
      })
    },
    removeModelEventListener () {
      this.model.off('notification')
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
    setup () {
      this.getResources()
    },
    async getResources () {
      this.isLoading = true
      try {
        await this.resourcesCollection.fetchAll()
        await this.setRoleResourceName()
        this.setInitialResourceData()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async setRoleResourceName () {
      let resources = this.resourcesCollection.getModels()
      let currentRoleResources = this.model.get('role_resources')
      for (let cR of currentRoleResources) {
        for (let r of resources) {
          if (cR.resource_id == r.get('id')) {
            cR.name = r.get('name')
            break
          }
        }
      }
      this.model.sync()
    },
    onChangeInputValue (propName, value) {
      this.model.set(propName, value)
    },
    addToRoleResources (index) {
      let selectedResource = this.resourceOptions[index]
      let currentRoleResources = this.model.get('role_resources')
      let cResource = null
      for (let cr of currentRoleResources)
        if (cr.resource_id === selectedResource.resource_id) {
          cResource = cr
          cResource.removed = false
          break
        }
      if (cResource === null) {
        let resource = {
          name: selectedResource.name,
          role_id: this.model.get('id'),
          resource_id: selectedResource.resource_id,
          permission: '',
        }
        currentRoleResources.push(resource)
        this.model.set('role_resources', currentRoleResources)
      }
      this.setInitialResourceData()
    },
    addToResources (index) {
      let currentRoleResources = this.model.get('role_resources')
      if (currentRoleResources[index].id)
        currentRoleResources[index].removed = true
      else
        currentRoleResources.splice(index, 1)
      this.model.set('role_resources', currentRoleResources)
      this.setInitialResourceData()
    },
    setInitialResourceData () {
      this.resourceOptions = []
      let currentRoleResources = this.model.get('role_resources')
      let isFreeResource = true
      for (let resource of this.resourcesCollection.getModels()) {
        isFreeResource = true
        for (let cResource of currentRoleResources) {
          if (!cResource.removed && resource.id === cResource.resource_id) {
            isFreeResource = false
          }
        }
        if (isFreeResource)
          this.resourceOptions.push({
            resource_id: resource.id,
            name: `${ resource.name }`,
          })
      }
    },
    openPermissionsModal (index) {
      this.currentResourceModalIndex = index
      let resource = this.model.get('role_resources')[index]
      let resourcePermissions =  resource.permission
      this.modalPermissionsTitle = `permissions for ${ resource.name }`
      this.modalPermissionsCheckboxNames = []
      this.modalPermissionsCheckboxNames = [
        {
          name: 'create',
          letter: 'c',
          value: resourcePermissions.includes('c'),
        },
        {
          name: 'read',
          letter: 'r',
          value: resourcePermissions.includes('r'),
        },
        {
          name: 'update',
          letter: 'u',
          value: resourcePermissions.includes('u'),
        },
        {
          name: 'delete',
          letter: 'd',
          value: resourcePermissions.includes('d'),
        },
        {
          name: 'view',
          letter: 'v',
          value: resourcePermissions.includes('v'),
        },
      ]
      this.modalPermissionsIsVisible = true
    },
    modalPermissionsClose () {
      this.modalPermissionsIsVisible = false
    },
    modalPermissionsAccept (data) {
      let currentRoleResources = this.model.get('role_resources')
      let permissions = []
      this.modalPermissionsIsVisible = false
      for (let itemP of data) {
        if (itemP.letter === 'c' && itemP.value)
          permissions.push('c')
        if (itemP.letter === 'r' && itemP.value)
          permissions.push('r')
        if (itemP.letter === 'u' && itemP.value)
          permissions.push('u')
        if (itemP.letter === 'd' && itemP.value)
          permissions.push('d')
        if (itemP.letter === 'v' && itemP.value)
          permissions.push('v')
      }
      currentRoleResources[this.currentResourceModalIndex].permission = permissions.join(',')
      this.model.set('role_resources', currentRoleResources)
    },
    showConfirmationModal () {
      this.$emitter.emit('confirmation-modal', this.confirmationModalData)
    },
    acceptAction () {
      this.$emitter.emit('confirmation-modal', null)
      this.isLoading = true
      this.model.delete()
        .finally(() => {
          this.isLoading = false
          this.router.replace({
            name: 'roles',
            params: {
              page: 1,
            },
          })
        })
    },
    cancelAction () {
      this.$emitter.emit('confirmation-modal', null)
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
.role-wrapper {
  position: relative;
}

h3 {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  flex-grow: 1;
  font-size: var(--main-font-size);
  font-weight: 600;
  margin: 30px 0 15px 0;
  text-transform: uppercase;
}

.buttons-wrapper {
  bottom: -32px;
  display: flex;
  justify-content: flex-end;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  width: calc(100% - 20px);
  z-index: 1;
}

.content-wrapper {
  box-sizing: content-box;
  margin-bottom: 40px;
}

.dropdown-select {
  margin-top: 10px;
}

#doubleBoxWrapper {
  border-radius: 10px;
  border: 1px solid transparent;
  display: flex;
  margin: 10px 0;
}

#leftBox, #rightBox {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 50%;
}

#rightBox {
  border-left: 1px solid #eee;
}

.sub-title {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  flex-grow: 1;
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  margin: 5px 0;
  text-transform: uppercase;
}

.boxlist-wrapper {
  box-sizing: border-box;
  display: block;
  max-height: 320px;
  padding: 10px;
  width: 100%;
}

.item-permissions {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  padding-right: 10px;
  pointer-events: none;
}
</style>
