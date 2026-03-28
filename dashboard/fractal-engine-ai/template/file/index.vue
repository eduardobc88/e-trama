<template lang="html">
  <div>
    <Widget
      sectionTitle="primary information"
      sectionDescription="basic data"
      v-bind:isLoading="isLoading"
      v-bind:isCard="true">
      <Grid>
        <template #slota>
          <div>
            <form
              v-if="isNew"
              enctype="multipart/form-data"
              method="POST">
              <div
                v-bind:class="{
                  'dropzone': true,
                  'error': fileFileError,
                }"
                ref="dropzone">
                <div>
                  <p class="description">
                    {{ $t('Choose a file or drag it here') }}
                  </p>
                  <p class="file-name">
                    {{ fileName }}
                  </p>
                  <i class="material-symbols-rounded">
                    cloud_upload
                  </i>
                </div>
              </div>
              <input
                class="file-input"
                type="file"
                ref="file"
                name="file"
                @change="addFile()"/>
            </form>
            <div
              class="file-thumbnail"
              v-if="!isNew && coverImageURL !== ''"
              v-bind:style="coverImageURL">
            </div>
            <div class="content-wrapper">
              <InputText
                class="input"
                inputName="Title"
                v-bind:inputValue="model.get('file_title')"
                v-bind:onChangeValue="onChangeInputValue"
                propName='file_title'
                v-bind:errorMessage="model.errors.file_title"
                helperMessage="Insert a title for this file"/>
            </div>
            <Button
                v-if="!isNew"
                class="file-download"
                buttonIcon="cloud_download"
                v-bind:buttonAction="openFile">
              {{ $t('open') }}
            </Button>
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
  </div>
</template>

<script>
import {
  useRouter,
  useRoute
} from 'vue-router'

import BoxWrapper from '../../component/box-wrapper.vue'
import Button from '../../component/button.vue'
import CONFIG_MANIFEST from "../../config-manifest";
import FloatButtonOptions from '../../component/float-button-options.vue'
import Grid from '../../component/grid.vue'
import InputText from '../../component/input-text.vue'
import Widget from '../../component/widget.vue'

export default {
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      isNew: true,
      model: new this.$model.FileMC.model(),
      formData: new FormData(),
      fileStatusIndex: 0,
      fileDate: '',
      dragAndDropCapable: false,
      fileName: '',
      isLoading: false,
      fileFileError: false,
      confirmationModalData: {
        modalTitle: 'do you want delete this file?',
        modalDescription: 'this action will delete this file',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      floatOptions: [],
      coverImageURL: '',
    }
  },
  components: {
    BoxWrapper,
    Button,
    FloatButtonOptions,
    Grid,
    InputText,
    Widget,
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
  mounted () {
    if (this.isNew)
      setTimeout(this.addDragEnterAndLeaveEventListener, 1000)
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
        await this.getCoverImage()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    onChangeInputValue (propName, value) {
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
    openFile () {
      let fileURL = this.model.getFileURL()
      window.open(fileURL, '_blank')
    },
    async getCoverImage () {
      let fileURL = this.model.getPreviewURL()
      let style = ''
      style += `background-image: url('${ fileURL }');`
      style += 'background-size: cover;'
      style += 'background-position: center;'
      this.coverImageURL = style
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
    addFile () {
      this.formData.delete('file_title')
      this.formData.delete('file_name')
      this.formData.delete('file_original_name')
      this.formData.delete('fule_mime_type')
      this.formData.delete('file_size')
      this.formData.delete('file')
      this.formData.append('file_name', this.$refs['file'].files[0].name)
      this.formData.append('file_original_name', this.$refs['file'].files[0].name)
      this.formData.append('fule_mime_type', this.$refs['file'].files[0].type)
      this.formData.append('file_size', this.$refs['file'].files[0].size)
      this.formData.append('file', this.$refs['file'].files[0])
      this.fileName = this.$refs['file'].files[0].name
      let fileTitle = this.model.get('file_title')
      if (fileTitle === '')
        this.model.set('file_title', this.fileName)
      this.fileFileError = false
    },
    addDragEnterAndLeaveEventListener () {
      this.$refs['file'].addEventListener('dragover', e => {
        e.preventDefault()
        e.stopPropagation()
        this.$refs['dropzone'].classList.add('dragover')
      })
      this.$refs['file'].addEventListener('dragleave', e => {
        e.preventDefault()
        e.stopPropagation()
        this.$refs['dropzone'].classList.remove('dragover')
      })
      this.$refs['file'].addEventListener('drop', e => {
        this.$refs['dropzone'].classList.remove('dragover')
      })
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
      if (this.isNew) {
        this.save()
        return
      }
      this.update()
    },
    async save () {
      this.isLoading = true
      try {
        this.formData.append('file_title', this.model.get('file_title'))
        this.formData.append('file_description', this.model.get('file_description'))
        let data = await this.$axios.post(CONFIG_MANIFEST.app_upload_file_url, this.formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'csrf-token': this.$getCookie('csrf-token'),
          },
        })
        let routeName = this.route.name
        this.router.replace({
          name: routeName,
          params: {
            id: data.data.data.id,
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
        await this.model.delete()
        let routeName = this.route.name
        this.router.replace({
          name: `${ routeName }s`,
          params: {
            page: 1,
          },
        })
      } catch (err) {
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
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
        this.model.setOption('isActiveRequest', false)
      }
    },
  }
}

</script>

<style scoped lang="css">

form {
  margin-top: 10px;
}

.file-thumbnail {
  background-color: var(--main-box-bg-color);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-sizing: border-box;
  color: var(--main-text-color);
  display: flex;
  height: 200px;
  left: 0;
  opacity: 0.3;
  overflow: hidden;
  padding: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

.file-thumbnail:after {
  bottom: 0;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.content-wrapper {
  box-sizing: content-box;
  margin-bottom: 40px;
  margin-top: 150px;
  position: relative;
}

.file-download {
  justify-self: end;
}

.date-wrapper {
  color: var(--main-text-color);
  display: block;
  font-size: var(--main-font-size);
  font-weight: 600;
  margin-top: 15px;
  text-align: right;
}

.dropzone {
  background-color: var(--main-box-bg-color);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border: 2px dashed #ccc;
  box-sizing: border-box;
  color: var(--main-text-color);
  display: flex;
  height: 200px;
  left: 0;
  pointer-events: none;
  position: relative;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  position: absolute;
}

.dropzone.error {
  border: 2px dashed red;
}

.dropzone.dragover {
  background-color: #ccc;
}

.description {
  font-size: 15px;
  margin: 10px;
}

.file-name {
  font-size: 16px;
  margin: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
}

.dropzone i {
  font-size: 40px;
}

.dropzone div {
  align-self: center;
  display: flex;
  flex-direction: column;
  margin: auto;
  text-align: center;
}

.file-input {
  background-color: transparent;
  cursor: pointer;
  display: flex;
  height: 200px;
  left: 0;
  opacity: 0;
  outline: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

</style>
