
<template lang="html">
  <div class="transition-wrapper">
    <Grid>
      <template #slota>
      </template>
      <template #slotb>
        <div
          class="box">
          <Widget
            sectionTitle="primary information"
            sectionDescription="basic data"
            v-bind:isLoading="isLoading"
            width="100%">
            <div>
              <div class="form-wrapper">
                <Checkbox
                  label="use google drive"
                  v-bind:onChangeValue="onChangeInputValue"
                  v-bind:isEmbeded="false"
                  v-bind:isAlignLeft="true"
                  propName="use_google_drive"
                  v-bind:item="model"
                  v-bind:currentValue="model.get('use_google_drive')"
                  v-bind:errorMessage="model.errors.use_google_drive"/>
                <template v-if="model.get('use_google_drive')">
                  <h4>Important Considerations:</h4>
                  <p class="info">
                    Service accounts created after April 15, 2025, have a 0-byte storage quota for Google Drive. This makes them inherently unable to own files in "My Drive" and emphasizes the need for Shared Drives or impersonation.
                  </p>
                  <p class="info">
                    Files uploaded by a service account are owned by that service account. If not using a Shared Drive or impersonation, the service account will attempt to consume its own (zero) quota, leading to the error.
                  </p>
                  <p class="info">
                    Shared Drives offer a more robust and scalable solution for managing files and folders with service accounts in a collaborative environment.
                  </p>
                  <p class="info">
                    enable google drive api and create service account
                  </p>
                  <InputText
                    inputName="folder id"
                    v-bind:inputValue="model.get('gd_folder_id')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName="gd_folder_id"
                    v-bind:errorMessage="model.errors.gd_folder_id"
                    helperMessage="22dtUDoFr7Px6a12R-D9E6ulrOPtAhdFA"/>
                  <InputText
                    inputName="auth client email"
                    v-bind:inputValue="model.get('gd_auth_client_email')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName="gd_auth_client_email"
                    v-bind:errorMessage="model.errors.gd_auth_client_email"
                    helperMessage="ims-gd-fractal@fractaliam.gserviceaccount.com"/>
                  <InputTextarea
                    inputName="auth private key"
                    v-bind:inputValue="model.get('gd_auth_private_key')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName="gd_auth_private_key"
                    v-bind:errorMessage="model.errors.gd_auth_private_key"
                    helperMessage="-----BEGIN PRIVATE KEY-----..."/>
                </template>
                <InputText
                  inputName="items by page"
                  inputType="number"
                  v-bind:inputValue="model.get('items_by_page')"
                  v-bind:onChangeValue="onChangeInputValue"
                  propName="items_by_page"
                  v-bind:errorMessage="model.errors.items_by_page"
                  helperMessage="1 - 100"/>
              </div>
            </div>
          </Widget>
        </div>
      </template>
      <template #slotc>
        <div></div>
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

import Checkbox from '../../component/checkbox.vue'
import FloatButtonOptions from '../../component/float-button-options.vue'
import Grid from '../../component/grid.vue'
import InputText from '../../component/input-text.vue'
import InputTextarea from '../../component/input-textarea.vue'
import Widget from '../../component/widget.vue'


export default {
  components: {
    Checkbox,
    FloatButtonOptions,
    Grid,
    InputText,
    InputTextarea,
    Widget,
  },
  data () {
    return {
      model: new this.$model.SettingsMC.model(),
      isLoading: false,
    }
  },
  created() {
    this.createModelEventListener()
    this.getData()
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

        this.setup()
      })
    },
    removeModelEventListener () {
      this.model.off('notification')
    },
    generateFloatOptions () {
      this.floatOptions = [
        {
          icon: 'save',
          name: 'update',
          action: this.validate,
          hidden: false,
          type: 'update',
          show: !this.isNew,
        },
      ]
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
    async setup () {
      this.model.sync()
    },
    onChangeInputValue (propName, value) {
      this.model.set(propName, value)
    },
    async validate () {
      let isActiveRequest = this.model.getOption('isActiveRequest')
      if (isActiveRequest)
        return

      this.model.setOption('isActiveRequest', true)
      let errors = await this.model.validate()
      if (!_.isEmpty(errors)) {
        this.model.setOption('isActiveRequest', false)
        return
      }
      this.update()
    },
    async update () {
      this.isLoading = true
      try {
        await this.model.put()
        this.model.set('user_pass', '')
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.model.setOption('isActiveRequest', false)
      }
    },
  },
}
</script>

<style scoped lang="css">

h4 {
  color: var(--main-text-color);
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  line-height: 1;
  margin: 0;
  position: relative;
  text-transform: uppercase;
  width: 100%;
  z-index: 1;
}
</style>
