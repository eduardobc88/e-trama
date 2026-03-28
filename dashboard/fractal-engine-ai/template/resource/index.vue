<template lang="html">
  <div>
    <Widget
      sectionTitle="primary information"
      sectionDescription="basic data"
      v-bind:isLoading="isLoading"
      width="100%">
      <Grid>
        <template #slota>
          <div class="form-wrapper">
            <InputText
              inputName="name"
              v-bind:inputValue="resource.name"
              v-bind:onChangeValue="onChangeInputValue"
              propName="name"
              v-bind:errorMessage="resource.errors.name"
              helperMessage="at least 2 characters without spaces"/>
            <InputText
              class="input"
              inputName="description"
              v-bind:inputValue="resource.description"
              v-bind:onChangeValue="onChangeInputValue"
              propName="description"
              v-bind:errorMessage="resource.errors.description"
              helperMessage="at least 2 characters"/>
            <InputText
              inputName="path"
              v-bind:inputValue="resource.get('path')"
              v-bind:onChangeValue="onChangeInputValue"
              propName="path"
              v-bind:errorMessage="resource.errors.path"
              helperMessage="at least 2 characters"/>
            <Checkbox
              label="menu"
              v-bind:onChangeValue="onChangeCheckbox"
              propName="menu"
              v-bind:isAlignLeft="true"
              v-bind:currentValue="resource.get('menu')"/>
            <Checkbox
              label="records"
              v-bind:onChangeValue="onChangeCheckbox"
              propName="records"
              v-bind:isAlignLeft="true"
              v-bind:currentValue="resource.get('records')"/>
            <InputText
              inputName="icon"
              v-bind:inputValue="resource.icon"
              v-bind:onChangeValue="onChangeInputValue"
              propName="icon"
              v-bind:errorMessage="resource.errors.icon"
              helperMessage="from google material icons"/>
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

import Grid from '../../component/grid.vue'
import Button from '../../component/button.vue'
import InputText from '../../component/input-text.vue'
import Widget from '../../component/widget.vue'
import FloatButtonOptions from '../../component/float-button-options.vue'
import Checkbox from '../../component/checkbox.vue'


export default {
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      isNew: true,
      resource: new this.$model.ResourceMC.model(),
      confirmationModalData: {
        modalTitle: 'do you want delete this resource?',
        modalDescription: 'this action will delete this resource',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      isLoading: false,
      floatOptions: [],
    }
  },
  components: {
    Grid,
    Button,
    InputText,
    Widget,
    Checkbox,
    FloatButtonOptions,
  },
  created () {
    let routeParamId = this.route.params.id
    if (routeParamId !== undefined && routeParamId !== '') {
      this.isNew = false
      this.resource.set('id', routeParamId)
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
    onChangeInputValue (propName, value) {
      this.resource.set(propName, value)
    },
    onChangeCheckbox (propName, value, index) {
      this.resource.set(propName, value)
    },
    async getData () {
      this.isLoading = true
      try {
        await this.resource.fetch()
        this.setup()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    setup () {
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
        let isActiveRequest = this.resource.getOption('isActiveRequest')
        if (isActiveRequest)
          return

        this.resource.setOption('isActiveRequest', true)
        let errors = await this.resource.validate()
        if (!_.isEmpty(errors)) {
          this.resource.setOption('isActiveRequest', false)
          return
        }
        if (this.isNew) {
          this.save()
          return
        }
        this.update()
      } catch (err) {
        this.resource.setOption('isActiveRequest', false)
        console.error(err)
      }
    },
    async save () {
      this.isLoading = true
      try {
        let routeName = this.route.name
        let data = await this.resource.save()
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
        this.resource.setOption('isActiveRequest', false)
      }
    },
    async delete () {
      this.isLoading = true
      try {
        let routeName = this.route.name
        let data = await this.resource.delete()
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
        this.resource.setOption('isActiveRequest', false)
      }
    },
    async update () {
      this.isLoading = true
      try {
        await this.resource.put()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.resource.setOption('isActiveRequest', false)
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
.resource {
  position: relative;
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

.resource-thumbnail {
  background-color: var(--main-box-bg-color);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-sizing: border-box;
  color: var(--main-text-color);
  display: flex;
  height: 200px;
  left: 0;
  overflow: hidden;
  padding: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

.resource-thumbnail:after {
  background-color: var(--main-box-bg-color);
  bottom: 0;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.content-wrapper {
  box-sizing: content-box;
  position: relative;
}

.header-action-buttons-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 0;
  position: relative;
  right: 0;
  top: 0;
  z-index: 1;
}
</style>
