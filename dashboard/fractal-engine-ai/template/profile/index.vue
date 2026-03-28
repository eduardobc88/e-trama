
<template lang="html">
  <div class="transition-wrapper">
    <Grid>
      <template #slota>
        <div class="box">
          <div id="user-info">
            <div id="user-avatar-wrapper">
              <div
                id="user-avatar"
                v-on:click="openFileAvatarModal">
                <div
                  class="user-image-color"
                  v-if="profile.get('profile_file_id') > 0"
                  v-bind:style="avatarStyle">
                </div>
                <div
                  class="user-image-color"
                  v-if="!profile.get('profile_file_id')"
                  v-bind:style="getStyles(profile.get('user_first_name'))">
                  <span class="user-letter">
                    {{ getUserFirstLetter(profile) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="data">
              <label>
                {{ $t('nombre') }}
              </label>
              <p>
                {{ `${ profile.get('user_first_name') } ${ profile.get('user_last_name') }` }}
              </p>
            </div>
            <div class="data">
              <label>
                {{ $t('usuario') }}
              </label>
              <p>
                {{ profile.get('user_name') }}
              </p>
            </div>
            <div class="data">
              <label>
                {{ $t('email') }}
              </label>
              <p>
                {{ profile.get('user_email') }}
              </p>
            </div>
            <div class="data">
              <label>
                {{ $t('phone') }}
              </label>
              <p>
                {{ profile.get('phone') }}
              </p>
            </div>
            <div class="data">
              <label>
                {{ $t('register') }}
              </label>
              <p>
                {{ profile.get('created_at') }}
              </p>
            </div>
          </div>
        </div>
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
                <InputText
                  inputName="first name"
                  v-bind:inputValue="profile.get('user_first_name')"
                  v-bind:onChangeValue="onChangeInputValue"
                  propName="user_first_name"
                  v-bind:errorMessage="profile.errors.user_first_name"
                  helperMessage="at least 2 characters"/>
                <InputText
                  inputName="last name"
                  v-bind:inputValue="profile.get('user_last_name')"
                  v-bind:onChangeValue="onChangeInputValue"
                  propName="user_last_name"/>
                <InputText
                  inputName="user name"
                  v-bind:inputValue="profile.get('user_name')"
                  disabled="true"/>
                <InputText
                  inputName="new password"
                  v-bind:inputValue="profile.get('user_pass')"
                  v-bind:onChangeValue="onChangeInputValue"
                  propName="user_pass"
                  v-bind:errorMessage="profile.errors.user_pass"
                  helperMessage="at least 2 characters"/>
                <InputText
                  inputName="email"
                  v-bind:inputValue="profile.get('user_email')"
                  v-bind:onChangeValue="onChangeInputValue"
                  propName="user_email"
                  v-bind:errorMessage="profile.errors.user_email"
                  helperMessage="Example: user@reactivecms.com"/>
                <InputText
                  inputName="phone"
                  v-bind:inputValue="profile.get('phone')"
                  v-bind:onChangeValue="onChangeInputValue"
                  propName="phone"
                  v-bind:errorMessage="profile.errors.phone"
                  helperMessage="4431038475"/>
                <InputText
                  inputName="role"
                  v-bind:inputValue="profile.get('role_name')"
                  disabled="true"/>
                <InputText
                  inputName="position"
                  v-bind:inputValue="profile.get('position')"
                  v-bind:onChangeValue="onChangeInputValue"
                  propName="position"
                  v-bind:errorMessage="profile.errors.position"
                  helperMessage="example: brigadista al frente"/>
                <FormSearchDropdownSelect
                  title="language"
                  helpMsg="select language"
                  errorMsg=""
                  v-bind:collection="languageCollection"
                  v-bind:currentValue="profile.get('language_id_ref')"
                  v-bind:onSelectOption="onSelectOption"
                  propName="language_id"
                  propNameToShow="search_show"/>
                <Checkbox
                  label="sync theme os"
                  v-bind:onChangeValue="onChangeInputValue"
                  v-bind:isEmbeded="false"
                  v-bind:isAlignLeft="true"
                  propName="theme"
                  v-bind:item="profile"
                  v-bind:currentValue="profile.get('theme')"
                  v-bind:errorMessage="profile.errors.theme"/>
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
import FloatButtonOptions from '../../component/float-button-options.vue'
import InputText from '../../component/input-text.vue'
import FormSearchDropdownSelect from '../../component/form-search-dropdown-select.vue'
import Widget from '../../component/widget.vue'
import Grid from '../../component/grid.vue'
import FormDropdownSelect from '../../component/form-dropdown-select.vue'
import Checkbox from '../../component/checkbox.vue'

export default {
  data () {
    return {
      profile: new this.$model.ProfileMC.model({
        id: this.$getCookie('user_id'),
      }),
      languageCollection: new this.$model.LanguageMC.collection(),
      fileModalAvatarData: {
        onlyImages: true,
        modalTitle: 'set avatar image',
        modalDescription: 'choose one image or upload new',
        closeFileModal: this.closeFileAvatarModal,
        onFileSelect: this.onFileAvatarSelect,
      },
      isLoading: false,
      avatarStyle: '',
    }
  },
  components: {
    Checkbox,
    FloatButtonOptions,
    Widget,
    InputText,
    Grid,
    FormSearchDropdownSelect,
    FormDropdownSelect,
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
      this.profile.on('notification', event => {
        let isActiveRequest = this.profile.getOption('isActiveRequest')
        if (isActiveRequest && event.method !== 'put')
          return

        this.setup()
      })
    },
    removeModelEventListener () {
      this.profile.off('notification')
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
        await this.profile.fetch()
        this.setup()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    setup () {
      this.profile.sync()
      this.setAvatarImage()
    },
    onChangeInputValue (propName, value) {
      this.profile.set(propName, value)
    },
    onFileAvatarSelect (file) {
      this.profile.set({
        'profile_file_id': file.get('id'),
        'profile_file_id_ref': file.get('file_name'),
      })
      this.closeFileAvatarModal()
      this.setAvatarImage()
    },
    openFileAvatarModal () {
      this.$emitter.emit('file-modal', this.fileModalAvatarData)
    },
    closeFileAvatarModal () {
      this.$emitter.emit('file-modal', null)
    },
    setAvatarImage () {
      let style = ''
      style += `background-image: url("/upload/${ this.profile.get('area_id') }/${ this.profile.get('profile_file_id_ref') }");`
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
    getUserFirstLetter (profile) {
      if (!profile.get('user_first_name'))
        return

      return profile.get('user_first_name')[0]
    },
    onSelectOption (option, propName) {
      let object = {}
      if (option === null)
        return

      object[propName] = option.get('id')
      object[`${ propName }_ref`] = option.get('search_show')
      this.profile.set(object)
    },
    onAddItemFile (file, propName) {
      let id = file.get('id')
      let ids = this.profile.get('file_ids')
      if (ids.indexOf(id) >= 0)
        return

      ids.push(id)
      this.profile.set('file_ids', ids)
    },
    onClickRemoveFile (data, propName) {
      let id = data.file.get('id')
      let ids = this.profile.get('file_ids')
      let index = ids.indexOf(id)
      ids.splice(index, 1)
      this.profile.set('file_ids', ids)
    },
    async validate () {
      let isActiveRequest = this.profile.getOption('isActiveRequest')
      if (isActiveRequest)
        return

      this.profile.setOption('isActiveRequest', true)
      let errors = await this.profile.validate()
      if (!_.isEmpty(errors)) {
        this.profile.setOption('isActiveRequest', false)
        return
      }
      this.update()
    },
    async update () {
      this.isLoading = true
      try {
        await this.profile.put()
        this.profile.set('user_pass', '')
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.profile.setOption('isActiveRequest', false)
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
  cursor: pointer;
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
