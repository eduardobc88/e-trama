<template lang="html">
  <div>
    <Grid>
      <template #slota>
        <div class="box">
          <div id="user-info">
            <div id="user-avatar-wrapper"
              v-on:click="openFileAvatarModal">
              <div id="user-avatar">
                <div
                  class="user-image-color"
                  v-if="user.get('profile_file_id')"
                  v-bind:style="avatarStyle">
                </div>
                <div
                  class="user-image-color"
                  v-if="!user.get('profile_file_id')"
                  v-bind:style="getStyles(user.get('user_first_name'))">
                  <span class="user-letter">
                    {{ getUserFirstLetter(user) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="data">
              <label>
                {{ $t('nombre') }}
              </label>
              <p>
                {{ `${ user.get('user_first_name') } ${ user.get('user_last_name') }` }}
              </p>
            </div>
            <div class="data">
              <label>
                {{ $t('usuario') }}
              </label>
              <p>
                {{ user.get('user_name') }}
              </p>
            </div>
            <div class="data">
              <label>
                {{ $t('email') }}
              </label>
              <p>
                {{ user.get('user_email') }}
              </p>
            </div>
            <div class="data">
              <label>
                {{ $t('phone') }}
              </label>
              <p>
                {{ user.get('phone') }}
              </p>
            </div>
            <div
              v-if="!isNew"
              class="data">
              <label>
                {{ $t('status') }}
              </label>
              <p>
                {{ user.get('user_status') }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <template #slotb>
        <div class="box">
          <Widget
            sectionTitle="primary information"
            sectionDescription="basic data"
            v-bind:isLoading="isLoading"
            width="100%">
            <Grid>
              <template #slota>
                <div class="form-wrapper">
                  <InputText
                    inputName="first name"
                    v-bind:inputValue="user.get('user_first_name')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName="user_first_name"
                    v-bind:errorMessage="user.errors.user_first_name"
                    helperMessage="at least 2 characters"/>
                  <InputText
                    inputName="last name"
                    v-bind:inputValue="user.get('user_last_name')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName="user_last_name"/>
                  <InputText
                    inputName="user name"
                    v-bind:inputValue="user.get('user_name')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName="user_name"
                    v-bind:errorMessage="user.errors.user_name"
                    helperMessage="at least 2 characters"/>
                  <InputText
                    inputName="new password"
                    v-bind:inputValue="user.get('user_pass')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName="user_pass"
                    v-bind:errorMessage="user.errors.user_pass"
                    helperMessage="at least 2 characters"/>
                  <InputText
                    inputName="email"
                    v-bind:inputValue="user.get('user_email')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName="user_email"
                    v-bind:errorMessage="user.errors.user_email"
                    helperMessage="Example: eduardobc.88@gmail.com"/>
                  <InputText
                    inputName="phone"
                    v-bind:inputValue="user.get('phone')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName="phone"
                    v-bind:errorMessage="user.errors.phone"
                    helperMessage="4431038475"/>
                  <FormSearchDropdownSelect
                    title="role"
                    helpMsg="select role"
                    v-bind:errorMsg="user.errors.role_id"
                    v-bind:collection="roleCollection"
                    v-bind:currentValue="user.get('role_id_ref')"
                    v-bind:onSelectOption="onSelectOption"
                    propName="role_id"
                    propNameToShow="search_show"/>
                  <FormSearchDropdownSelect
                    title="area"
                    helpMsg="select area"
                    v-bind:errorMsg="user.errors.area_id"
                    v-bind:collection="areaCollection"
                    v-bind:currentValue="user.get('area_id_ref')"
                    v-bind:onSelectOption="onSelectOption"
                    propName="area_id"
                    propNameToShow="search_show"/>
                  <InputText
                    inputName="position"
                    v-bind:inputValue="user.get('position')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName="position"
                    v-bind:errorMessage="user.errors.position"
                    helperMessage="example: brigadista al frente"/>
                  <FormSearchDropdownSelect
                    title="language"
                    helpMsg="select language"
                    v-bind:errorMsg="user.errors.language_id"
                    v-bind:collection="languageCollection"
                    v-bind:currentValue="user.get('language_id_ref')"
                    v-bind:onSelectOption="onSelectOption"
                    propName="language_id"
                    propNameToShow="search_show"/>
                  <Checkbox
                    label="active"
                    v-bind:onChangeValue="onChangeInputValue"
                    v-bind:isEmbeded="false"
                    v-bind:isAlignLeft="true"
                    propName="user_active"
                    v-bind:item="user"
                    v-bind:currentValue="!!user.get('user_active')"
                    v-bind:errorMessage="user.errors.user_active"/>
                  <div v-if="!isNew" class="date-wrapper">
                    {{ user.get('created_at') }}
                  </div>
                </div>
              </template>
            </Grid>
          </Widget>
        </div>
      </template>
      <template #slotc>
        <div class="box">
        </div>
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

import Checkbox from '../../component/checkbox.vue'
import FloatButtonOptions from '../../component/float-button-options.vue'
import FormDropdownSelect from '../../component/form-dropdown-select.vue'
import FormSearchDropdownSelect from '../../component/form-search-dropdown-select.vue'
import Grid from '../../component/grid.vue'
import InputFile from '../../component/input-file.vue'
import InputText from '../../component/input-text.vue'
import InputTextarea from '../../component/input-textarea.vue'
import LoadingBar from '../../component/loading-bar.vue'
import Widget from '../../component/widget.vue'

export default {
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      isNew: true,
      user: new this.$model.UserMC.model(),
      roleCollection: new this.$model.RoleMC.collection(),
      languageCollection: new this.$model.LanguageMC.collection(),
      areaCollection: new this.$model.AreaMC.collection(),
      confirmationModalData: {
        modalTitle: 'do you want delete this user?',
        modalDescription: 'this action will delete this user',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      fileModalAvatarData: {
        onlyImages: true,
        modalTitle: 'set avatar Image',
        modalDescription: 'chose one image or upload new',
        closeFileModal: this.closeFileAvatarModal,
        onFileSelect: this.onFileAvatarSelect,
      },
      isLoading: false,
      floatOptions: [],
      avatarStyle: '',
    }
  },
  components: {
    Checkbox,
    FloatButtonOptions,
    FormDropdownSelect,
    FormSearchDropdownSelect,
    Grid,
    InputFile,
    InputText,
    InputTextarea,
    LoadingBar,
    Widget,
  },
  created () {
    let routeParamId = this.route.params.id
    if (routeParamId !== undefined && routeParamId !== '') {
      this.isNew = false
      this.user.set('id', routeParamId)
      this.createModelEventListener()
      this.getData()
    }
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
      this.user.on('notification', event => {
        let isActiveRequest = this.user.getOption('isActiveRequest')
        if (isActiveRequest && event.method !== 'put')
          return

        this.user.set('user_pass', '')
      })
    },
    removeModelEventListener () {
      this.user.off('notification')
    },
    async getData () {
      this.isLoading = true
      try {
        await this.user.fetch()
        this.setAvatarImage()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    getRoleId () {
      return this.$config.user_data.get('role_id')
    },
    async onSelectDropdownOption (data, index) {
      this.user.set(data.prop_name, data.name)
    },
    onSelectOption (option, propName) {
      let object = {}
      if (option === null)
        return

      object[propName] = option.get('id')
      object[`${ propName }_ref`] = option.get('search_show')
      this.user.set(object)
    },
    onChangeInputValue (propName, value) {
      this.user.set(propName, value)
    },
    onAddItemFile (file, propName) {
      let id = file.get('id')
      let ids = this.user.get('file_ids')
      if (ids.indexOf(id) >= 0)
        return

      ids.push(id)
      this.user.set('file_ids', ids)
    },
    onClickRemoveFile (data, propName) {
      let id = data.file.get('id')
      let ids = this.user.get('file_ids')
      let index = ids.indexOf(id)
      ids.splice(index, 1)
      this.user.set('file_ids', ids)
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
    removeFile () {
      this.user.set('user_thumbnail', '')
    },
    onFileAvatarSelect (file) {
      this.user.set({
        'profile_file_id': file.get('id'),
        'profile_file_id_ref': file.get('file_name'),
      })
      this.setAvatarImage()
      this.closeFileAvatarModal()
    },
    openFileAvatarModal () {
      this.$emitter.emit('file-modal', this.fileModalAvatarData)
    },
    closeFileAvatarModal () {
      this.$emitter.emit('file-modal', null)
    },
    removeFileAvatar () {
      this.user.set('profile_file_id', '')
    },
    onSelectRole (option) {
      this.user.set({
        'user_role': option.value,
        'role_id': option.value._id,
      })
    },
    setAvatarImage () {
      let style = ''
      style += `background-image: url("/upload/${ this.user.get('area_id') }/${ this.user.get('profile_file_id_ref') }");`
      style += 'background-size: cover;'
      style += 'background-position: center;'
      this.avatarStyle = style
    },
    getStyles (text) {
      if (text === '' || text === undefined || text === null)
        text = '.'
      text = `${ text }${ text.length }`
      let style = this.$getHexColor(text, false, 20, 50, 100)
      if (this.$config.is_light_theme)
        style = this.$getHexColor(text, false, 40, 80, 100)
      return style
    },
    getUserFirstLetter (user) {
      if (!user.get('user_first_name')) return

      return user.get('user_first_name')[0]
    },
    async validate () {
      try {
        let isActiveRequest = this.user.getOption('isActiveRequest')
        if (isActiveRequest)
          return

        this.user.setOption('isActiveRequest', true)
        let errors = await this.user.validate()
        if (!_.isEmpty(errors)) {
          this.user.setOption('isActiveRequest', false)
          return
        }
        this.isLoading = true
        if (this.isNew) {
          this.save()
          return
        }
        this.update()
      } catch (err) {
        console.error(err)
      }
    },
    async save () {
      try {
        let routeName = this.route.name
        let data = await this.user.save()
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
        this.user.setOption('isActiveRequest', false)
      }
    },
    async update () {
      try {
        await this.user.put()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.user.setOption('isActiveRequest', false)
      }
    },
    async delete () {
      try {
        let routeName = this.route.name
        let data = await this.user.delete()
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
        this.user.setOption('isActiveRequest', false)
      }
    },
  },
}
</script>

<style scoped lang="css">

.form-wrapper {
  box-sizing: content-box;
  margin-bottom: 40px;
  position: relative;
}

#user-info {
  margin: auto;
}

#user-avatar-wrapper {
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin: 0 0 24px 0;
  position: relative;
}

#user-avatar {
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  box-shadow: var(--main-box-shadow);
  display: flex;
  height: 150px;
  overflow: hidden;
  position: relative;
  width: 150px;
}

.user-letter {
  align-self: center;
  color: var(--main-text-color);
  font-size: 100px;
  font-weight: 300;
  line-height: 1;
  margin: auto;
  text-transform: uppercase;
}

.user-image-color {
  display: flex;
  width: 100%;
}

.date-wrapper {
  color: var(--main-text-color);
  display: block;
  font-size: var(--main-font-size);
  font-weight: 600;
  margin-top: 15px;
  text-align: right;
}

.box {
  display: flex;
  justify-content: center;
  max-width: 480px;
}

.data {
  display: grid;
  text-transform: uppercase;
  margin: 12px 0;
  justify-content: center;
  grid-template-columns: 1fr 1fr;
}

.data label {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  left: 6px;
  padding: 0 4px;
  pointer-events: none;
  text-align: right;
}

.data p {
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  left: 6px;
  padding: 0 4px;
  pointer-events: none;
  margin: 0;
  text-align: left;
}
</style>
