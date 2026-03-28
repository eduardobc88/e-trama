<template lang="html">
  <div id="modal-box-wrapper">
    <div id="position-wrapper">
      <LoadingBar v-if="isLoading"/>
      <div id="box-content">
        <div id="header">
          <h2>{{ $t(modalTitle) }}</h2>
          <p id="modal-description">
            {{ $t(modalDescription) }}
          </p>
        </div>
        <div id="content">
          <NavigationTab
            v-bind:isEmbededModal="true"
            v-bind:notExpanded="true"
            v-bind:tabIcons="tabIcons">
            <template #library>
              <div id="library-wrapper">
                <InputText
                  inputName="search"
                  v-bind:inputValue="searchValue"
                  v-bind:onChangeValue="onChangeInputValue"
                  propName=""/>
                <div id="file-scroll-wrapper">
                  <perfect-scrollbar v-on:scroll="onScroll">
                    <div
                      id="files-wrapper"
                      ref="fileWrapper">
                      <template
                        v-for="file in fileFiles.getModels()">
                        <div
                          class="image"
                          v-on:click="selectFileImage(file)"
                          v-if="showThisFile(file)"
                          v-bind:style="getPreview(file)">
                          <div
                            class="letter"
                            v-bind:style="getBKGColor(file)">
                            <p>
                              {{ file.get('file_title') }}
                            </p>
                          </div>
                        </div>
                      </template>
                    </div>
                  </perfect-scrollbar>
                </div>
              </div>
            </template>
            <template #upload>
              <div id="upload-wrapper">
                <div id="dropzone" ref="dropzone">
                  <div>
                    <p id="upload-description">
                      {{ $t('choose a file or drag it here') }}
                    </p>
                    <p id="upload-file-name">
                      {{ fileName }}
                    </p>
                    <i class="upload-icon material-symbols-rounded">
                      cloud_upload
                    </i>
                  </div>
                </div>
                <input
                  id="file-input"
                  type="file"
                  ref="file"
                  name="file"
                  @change="addFile()"/>
              </div>
            </template>
          </NavigationTab>
        </div>
        <div id="footer">
          <div v-if="activeTab === 0" id="file-info-wrapper">
            <div
              class="avatar"
              v-bind:style="$getHexColor(selectedFile.get('file_name'), false, 50, 75, 100)">
              <span>
                {{ selectedFile.file_title[0] }}
              </span>
            </div>
            <div id="select-file-data-wrapper">
              <p>
                {{ selectedFile.get('file_title') }}
              </p>
              <p>
                {{ selectedFile.get('file_name') }}
              </p>
            </div>
          </div>
          <div id="buttons-wrapper">
            <Button
              buttonIcon="clear"
              v-bind:buttonAction="closeFileModal"
              style="align-self: flex-end;">
              {{ $t('cancel') }}
            </Button>
            <Button
              v-if="activeTab === 0"
              buttonIcon="done"
              v-bind:buttonAction="selectFile"
              style="margin-left: 5px; align-self: flex-end;">
              {{ $t('accept') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'
import InputText from './input-text.vue'
import LoadingBar from './loading-bar.vue'
import NavigationTab from './navigation-tab.vue'

export default {
  components: {
    Button,
    InputText,
    LoadingBar,
    NavigationTab,
  },
  props: {
    modalTitle: {
      type: String,
      default: '',
    },
    modalDescription: {
      type: String,
      default: '',
    },
    closeFileModal: {
      type: Function,
      default: () => {},
    },
    onFileSelect: {
      type: Function,
      default: () => {},
    },
    onlyImages: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      fileFiles: new this.$model.FileMC.collection(),
      filePage: 1,
      totalItems: 0,
      totalPages: 1,
      selectedFile: new this.$model.FileMC.model(),
      searchValue: '',
      searchMimetype: 'image',
      activeTab: 0,
      formData: new FormData(),
      fileName: '',
      isLoading: false,
      tabIcons: [
        { slot_icon: 'browse', slot_name: 'library' },
        { slot_icon: 'upload', slot_name: 'upload' },
      ]
    }
  },
  created() {
    this.getFile()
  },
  updated() {
    if (this.activeTab) this.addDragEnterAndLeaveEventListener()
  },
  methods: {
    async getFile () {
      if (this.filePage <= this.totalPages) {
        this.isLoading = true
        this.fileFiles.set('page_number', this.filePage)
        try {
          let data = await this.fileFiles.fetch()
          this.totalPages = data.getData().total_pages
          this.filePage++
          if (this.filePage === 2)
            this.getFile()
          this.totalItems = data.getData().total_items
        } catch (err) {
          console.error(err)
        } finally {
          this.isLoading = false
        }
      }
    },
    selectFileImage (file) {
      this.selectedFile = file
    },
    onScroll (el) {
      let fileWrapper = this.$refs.fileWrapper
      if (
        fileWrapper.clientHeight + fileWrapper.scrollTop >=
        fileWrapper.scrollHeight
      )
        this.getFile()
    },
    showThisFile (file) {
      if (this.onlyImages === file.isImage())
        return true

      if (!this.onlyImages)
        return true

      return false
    },
    getBKGColor (file) {
      let text = file.get('file_name')
      if (text === '' || text === undefined || text === null)
        text = '.'
      text = `${ text }${ text.length }`
      let style = this.$getHexColor(text, false, 20, 50, 100)
      if (this.$config.is_light_theme)
        style = this.$getHexColor(text, false, 40, 80, 100)
      return style
    },
    getPreview (file) {
      let name = file.get('file_name')
      let style = this.$getHexColor(name, false, 40, 70, 100)
      let letter = this.$getHexColor(name, true, 30, 20, 100)
      if (file.isImage()) {
        let url = file.getPreviewURL()
        style = `
          background-image: url("${ url }");
          background-size: cover;
          background-position: center center;
        `
      }
      style = `${style} color: ${letter};`
      return style
    },
    resetLibraryData () {
      this.fileFiles.clear()
      this.filePage = 1
      this.totalItems = 0
      this.totalPages = 1
    },
    async onChangeInputValue (propName, value) {
      this.searchValue = value
      if (!this.searchValue) {
        this.resetLibraryData()
        this.getFile()
        return
      }
      this.isLoading = true
      this.fileFiles.clear()
      try {
        await this.fileFiles.search({
          s: this.searchValue,
          type: this.searchMimetype,
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    activeLibrary () {
      this.activeTab = 0
    },
    activeUpload () {
      this.activeTab = 1
    },
    addFile () {
      this.formData.delete('file_title')
      this.formData.delete('file_name')
      this.formData.delete('fule_mime_type')
      this.formData.delete('file_size')
      this.formData.delete('file')
      this.formData.append('file_title', this.$refs.file.files[0].name)
      this.formData.append('file_name', this.$refs.file.files[0].name)
      this.formData.append('fule_mime_type', this.$refs.file.files[0].type)
      this.formData.append('file_size', this.$refs.file.files[0].size)
      this.formData.append('file', this.$refs.file.files[0])
      this.fileName = this.$refs.file.files[0].name
      this.createFile()
    },
    addDragEnterAndLeaveEventListener () {
      this.$refs.file.addEventListener('dragover', e => {
        e.preventDefault()
        e.stopPropagation()
        this.$refs.dropzone.classList.add('dragover')
      })
      this.$refs.file.addEventListener('dragleave', e => {
        e.preventDefault()
        e.stopPropagation()
        this.$refs.dropzone.classList.remove('dragover')
      })
      this.$refs.file.addEventListener('drop', e => {
        this.$refs.dropzone.classList.remove('dragover')
      })
    },
    async createFile () {
      this.isLoading = true
      try {
        let data = await this.$axios.post(`${ this.$appApiBaseURL }/file/`, this.formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'csrf-token': this.$getCookie('csrf-token'),
          },
        })
        this.activeTab = 0
        this.resetLibraryData()
        this.getFile()
        // NOTE: AUTO SELECT LAST FILE UPLOADED
        setTimeout(() => {
          this.selectedFile.set(data.data.data)
          this.selectFile()
        }, 1000)
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    selectFile () {
      this.onFileSelect(this.selectedFile)
    },
  },
}
</script>

<style scoped lang="css">
h2 {
  color: var(--main-accent-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
}

#modal-description {
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  line-height: 20px;
  margin-bottom: 5px;
  margin-top: 0;
  text-transform: uppercase;
}

#modal-box-wrapper {
  background-color: var(--main-notification-bkg);
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 5;
}

#position-wrapper {
  box-sizing: border-box;
  margin: auto;
  max-width: 1145px;
  padding: 10px;
  position: relative;
  width: 100%;
}

#box-content {
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 480px;
  margin: auto;
  padding: 10px;
  position: relative;
  width: 100%;
}

#header,
#footer {
  flex-grow: 0;
}

#footer {
  display: flex;
  position: absolute;
  bottom: 10px;
  width: calc(100% - 20px);
  left: 0;
  right: 0;
  margin: auto;
}

#content {

}

#navgation-buttons {
  display: flex;
}

#library-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#files-wrapper {
  border-radius: 10px;
  display: grid;
  gap: 10px;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-template-rows: repeat(2, 1fr);
  height: 270px;
  margin: auto;
  width: calc(100% - 20px);
}

.image {
  border-radius: 10px;
  cursor: pointer;
  height: 150px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.image:after {
  content: "";
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 1;
}

.image:hover:after {
  background-color: var(--main-hover-color);
}

.image:active:after {
  background-color: var(--main-active-color);
}

#file-info-wrapper {
  display: flex;
  flex-grow: 1;
  width: calc(100% - 250px);
}

#file-info-wrapper p {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  height: 16px;
  line-height: 16px;
  margin: 0;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 5px);
}

#file-info-wrapper .avatar {
  align-self: center;
  border-radius: 10px;
  display: flex;
  height: 30px;
  justify-content: center;
  min-width: 30px;
  position: relative;
}

#file-info-wrapper .avatar span {
  align-self: center;
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
}

#select-file-data-wrapper {
  display: flex;
  flex-direction: column;
  left: 5px;
  position: relative;
  width: 100%;
}

#upload-wrapper {
  margin: auto;
  position: relative;
  width: 100%;
}

#dropzone {
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  border: 2px dashed #ccc;
  box-sizing: border-box;
  color: var(--main-text-color);
  display: flex;
  height: 260px;
  left: 0;
  padding: 10px;
  pointer-events: none;
  position: relative;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
}

#dropzone.dragover {
  background-color: #ccc;
}

.description {
  font-size: 20px;
  margin: 10px;
  text-transform: uppercase;
}

.file-name {
  font-size: 16px;
  margin: 10px;
}

#dropzone i {
  font-size: 40px;
}

#dropzone div {
  align-self: center;
  display: flex;
  flex-direction: column;
  margin: auto;
  text-align: center;
}

#file-input {
  cursor: pointer;
  display: flex;
  height: 260px;
  left: 0;
  opacity: 0;
  outline: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

#upload-description {
  font-size: 20px;
  margin: 10px;
}

#upload-file-name {
  font-size: 16px;
  margin: 10px;
}

#buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

#buttons-wrapper .button:last-child {
  color: var(--main-accent-color);
  margin-left: 10px;
}

#buttons-wrapper .button:hover {
  background-color: var(--main-hover-color);
}

#file-scroll-wrapper {
  position: relative;
  overflow: auto;
  margin: 10px 0 0 0;
  width: calc(100% + 20px);
  left: -10px;
}

.letter {
  align-items: end;
  bottom: 0;
  display: flex;
  height: 100%;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  text-transform: uppercase;
  top: 0;
  width: 100%;
}

.letter > p {
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  margin: 0;
  padding: 10px;
  z-index: 3;
}

</style>
