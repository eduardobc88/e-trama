<template lang="html">
  <div>
    <Widget
      sectionTitle="primary information"
      sectionDescription="basic data"
      v-bind:isLoading="isLoading"
      width="100%">
      <Grid>
        <template #slota>
          <div class="content-wrapper">
            <InputText
              class="input"
              inputName="name"
              v-bind:inputValue="language.get('language_name')"
              v-bind:onChangeValue="onChangeInputValue"
              propName="language_name"
              v-bind:errorMessage="language.errors.language_name"
              helperMessage="at least 2 characters without spaces"/>
            <CustomFields
              title="messages"
              v-bind:items="language.get('language_messages')"
              v-bind:onChangeCustomField="onChangeCustomField"
              v-bind:onAddCustomField="onAddCustomField"
              v-bind:onRemoveCustomField="onRemoveCustomField"
              v-bind:propNames="customFieldProps"/>
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
import CustomFields from '../../component/custom-fields.vue'
import FloatButtonOptions from '../../component/float-button-options.vue'

export default {
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      isNew: true,
      language: new this.$model.LanguageMC.model(),
      confirmationModalData: {
        modalTitle: 'do you want delete this language?',
        modalDescription: 'this action will delete this language',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      isLoading: false,
      customFieldProps: {
        leftPropName: 'language_message_key',
        rightPropName: 'language_message_value',
      },
      floatOptions: [],
    }
  },
  components: {
    Widget,
    Grid,
    InputText,
    CustomFields,
    FloatButtonOptions,
  },
  created () {
    let routeParamId = this.route.params.id
    if (routeParamId !== undefined && routeParamId.toString().length) {
      this.isNew = false
      this.language.set('id', routeParamId)
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
        await this.language.fetch()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    onChangeInputValue (propName, value) {
      this.language.set(propName, value)
    },
    onChangeCustomField (data, oldValue, newValue) {
      let languageMessages = this.language.get('language_messages')
      let message = languageMessages[data.index]
      if (data.key === 'language_message_key')
        message.language_message_key = newValue
      else if (data.key === 'language_message_value')
        message.language_message_value = newValue
      languageMessages[data.index] = message
      this.language.set('language_messages', languageMessages)
    },
    onAddCustomField ({key, value}) {
      let languageMessages = this.language.get('language_messages')
      languageMessages.unshift({
        id: 0,
        language_message_key: key,
        language_message_value: value,
      })
      this.language.set('language_messages', languageMessages)
    },
    onRemoveCustomField (index) {
      let languageMessages = this.language.get('language_messages')
      if (!languageMessages[index].id)
        languageMessages.splice(index, 1)
      else
        languageMessages[index].removed = true
      this.language.set('language_messages', languageMessages)
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
        let isActiveRequest = this.language.getOption('isActiveRequest')
        if (isActiveRequest)
          return

        this.language.setOption('isActiveRequest', true)
        let errors = await this.language.validate()
        if (!_.isEmpty(errors)) {
          this.language.setOption('isActiveRequest', false)
          return
        }
        if (this.isNew) {
          this.save()
          return
        }
        this.update()
      } catch (err) {
        this.language.setOption('isActiveRequest', false)
        console.error(err)
      }
    },
    async save () {
      this.isLoading = true
      try {
        let routeName = this.route.name
        let data = await this.language.save()
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
        this.language.setOption('isActiveRequest', false)
        this.isLoading = false
      }
    },
    async update () {
      this.isLoading = true
      try {
        await this.language.put()
      } catch (err) {
        console.error(err)
      } finally {
        this.language.setOption('isActiveRequest', false)
        this.isLoading = false
      }
    },
    async delete () {
      this.isLoading = true
      try {
        let routeName = this.route.name
        let data = await this.language.delete()
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
        this.language.setOption('isActiveRequest', false)
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped lang="css">
.language {
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
