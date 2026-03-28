<template lang="html">
  <div
    v-if="show"
    id="files-wrapper"
    v-bind:class="{
      'embeded': rowEmbeded,
    }">
    <div
      id="wrapper"
      v-bind:class="((fileCollection.getModels().length)?((showAddItem)?'not-empty':'not-empty hide'):'empty')">
      <div
        id="header">
        <div id="title">
          {{ $t(title) }} ({{ fileCollection.getModels().length }})
        </div>
        <div
          v-if="showAddItem && (readOnly === undefined || readOnly === false)"
          :key="$uuid.v1()"
          id="add-file-button"
          class="add-file"
          v-on:click="openFileModal">
          <i
            id="icon-add"
            class="material-symbols-rounded">
            add
          </i>
        </div>
      </div>
      <div
        id="files"
        v-if="fileCollection.getModels().length">
        <template
          v-for="(file, index) of fileCollection.getModels()">
          <div
            :key="file._uid"
            v-if="file"
            class="file">
            <div
              class="file-info"
              v-on:click="onFileClick(file)">
              <div
                class="thumbnail"
                v-bind:style="getStyles(file)">
                <i
                  class="letter">
                  {{ file.get('file_title')[0] }}
                </i>
              </div>
              <p class="file-name">
                {{ file.get('file_title') }}
              </p>
            </div>
            <div
              v-if="showTypes"
              class="type">
              <Checkbox
                v-bind:onChangeValue="onChangeCheckbox"
                label="wall"
                v-bind:item="file"
                v-bind:currentValue="file.get('type') === 'wall'"
                propName="wall"
                isAlignLeft="true"
                isEmbeded="true"/>
              <Checkbox
                v-bind:onChangeValue="onChangeCheckbox"
                label="spectacular"
                v-bind:item="file"
                v-bind:currentValue="file.get('type') === 'spectacular'"
                propName="spectacular"
                isAlignLeft="true"
                isEmbeded="true"/>
              <Checkbox
                v-bind:onChangeValue="onChangeCheckbox"
                label="canva"
                v-bind:item="file"
                v-bind:currentValue="file.get('type') === 'canva'"
                propName="canva"
                isAlignLeft="true"
                isEmbeded="true"/>
            </div>
            <ButtonIcon
              v-if="readOnly === undefined || readOnly === false"
              class="button-action"
              buttonIcon="cancel"
              v-bind:buttonAction="onClickToRemove"
              v-bind:buttonData="{file: file, index: index}"/>
          </div>
        </template>
      </div>
    </div>
    <label
      v-show="errorMessage"
      id="input-error-message">
      {{ $t(errorMessage) }}
    </label>
    <label
      v-show="!errorMessage"
      id="input-helper-message">
      {{ $t(helperMessage) }}
    </label>
  </div>
</template>

<script>

import ButtonIcon from './button-icon.vue'
import Checkbox from "./checkbox.vue";

export default {
  props: {
    multipleFiles: {
      type: Boolean,
      default: false,
    },
    model: {
      type: Object,
      default: {},
    },
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    onAddItem: {
      type: Function,
      default: () => {},
    },
    onClickRemove: {
      type: Function,
      default: () => {},
    },
    onlyImages: {
      type: Boolean,
      default: false,
    },
    types: {
      type: Array,
      default: [],
    },
    maxItems: {
      type: Number,
      default: 1,
    },
    propName: {
      type: String,
      default: '',
    },
    rowEmbeded: {
      type: Boolean,
      default: false,
    },
    helperMessage: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    showTypes: {
      type: Boolean,
      default: false,
    },
    isCustomEntityAttachment: {
      type: Boolean,
      default: false,
    },
    areaName: {
      type: String,
      default: '',
    },
    customEntityRecordId: {
      type: Number,
      default: 0,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      showAddItem: true,
      fileModalData: {
        onlyImages: false,
        modalTitle: 'all files',
        modalDescription: 'chose one file or upload new',
        closeFileModal: this.closeFileModal,
        onFileSelect: this.onFileSelect,
      },
      fileCollection: new this.$model.FileMC.collection(),
    }
  },
  watch: {
    maxItems (newVal, oldVal) {
      this.showAddItem = this.isMaxItems()
    },
  },
  created () {
    let items = []
    if (this.multipleFiles)
      items = this.model.get(this.propName)
    else if (this.model.get(this.propName))
      items = [this.model.get(this.propName)]
    this.fileCollection = []
    this.fileCollection = new this.$model.FileMC.collection()
    for (let i in items) {
      let id = items[i]
      let type = this.types[i]
      if (id !== '')
        this.addFileToCollection(id, type)
    }
  },
  updated () {
    this.showAddItem = this.isMaxItems()
  },
  components: {
    ButtonIcon,
    Checkbox,
  },
  methods: {
    openFileModal () {
      this.fileModalData.onlyImages = this.onlyImages
      this.$emitter.emit('file-modal', this.fileModalData)
    },
    closeFileModal () {
      this.$emitter.emit('file-modal', null)
    },
    onFileSelect (file) {
      this.onAddItem(file, this.propName)
      let id = file.get('id')
      if (this.multipleFiles) {
        let ids = this.model.get(this.propName)
        if (ids === null)
          ids = []
        if (ids.indexOf(id) >= 0)
          return

        ids.push(id)
        this.model.set(this.propName, ids)
      } else
        this.model.set(this.propName, id)
      this.updateCollectionFiles()
      this.closeFileModal()
    },
    updateCollectionFiles () {
      let items = []
      if (this.multipleFiles)
        items = this.model.get(this.propName)
      else if (this.model.get(this.propName))
        items = [this.model.get(this.propName)]
      this.fileCollection.clear()
      this.fileCollection = null
      this.fileCollection = new this.$model.FileMC.collection()
      for (let i in items) {
        let id = items[i]
        let type = this.types[i]
        if (id !== '')
          this.addFileToCollection(id, type)
      }
    },
    onClickToRemove (data) {
      this.onClickRemove(data, this.propName)
      let id = data.file.get('id')
      if (this.multipleFiles) {
        let ids = this.model.get(this.propName)
        let index = ids.indexOf(id)
        ids.splice(index, 1)
        this.model.set(this.propName, ids)
      } else
        this.model.set(this.propName, '')
      this.updateCollectionFiles()
    },
    onFileClick (file) {
      let fileURL = ''
      if (this.isCustomEntityAttachment && this.customEntityRecordId !== '') {
        file.set({
          area_name: this.areaName,
          custom_entity_record_id: this.customEntityRecordId,
        })
        fileURL = file.getAttachmentGDFileURL(true)
      } else
        fileURL = file.getGDFileURL(true)
      window.open(fileURL, '_blank')
    },
    getStyles (file) {
      let url = `/static/dashboard/fractal-engine-ai/assets/placeholder-file.jpeg`
      if (file.isImage())
        url = `/upload/${ file.get('area_id') }/${ file.get('file_name') }`
      let style = ''
      style += `background-image: url("${ url }");`
      style += 'background-size: cover;'
      style += 'background-position: center;'
      return style
    },
    isMaxItems () {
      if (this.fileCollection.getModels().length < parseInt(this.maxItems))
        return true

      return false
    },
    async addFileToCollection (id, type) {
      let newFile = new this.$model.FileMC.model({
        id: id,
        type: type,
      })
      if (this.fileCollection.getModels().length >= this.maxItems)
        return

      this.fileCollection.add(newFile)
      try {
        if (this.isCustomEntityAttachment && this.customEntityRecordId !== '') {
          newFile.set({
            area_name: this.areaName,
            custom_entity_record_id: this.customEntityRecordId,
          })
          await newFile.getAttachment()
        } else
          await newFile.fetch()
      } catch (err) {
        console.error('== error -> addFileToCollection ==', err)
      }
    },
    onChangeCheckbox (propName, value, model) {
      model.set('type', propName)
      let id = model.get('id')
      let index = this.model.get(this.propName).indexOf(id)
      this.types[index] = propName
    },
    removeFilesFromCollection (id) {
      for (let file in this.fileCollection.models) {
        if (id === file.get('id')) {
          file.removeFromAllCollections()
          break
        }
      }
    },
  },
}
</script>

<style scoped lang="css">

#header {
  position: absolute;
  top: -12px;
  width: 100%;
}

#title {
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 700;
  left: 10px;
  padding: 0 20px;
  pointer-events: none;
  position: absolute;
  text-transform: uppercase;
  top: 3px;
  transition-duration: 100ms;
}

#wrapper {
  border-radius: 8px;
  border: 1px solid var(--main-border-color);
  max-width: 480px;
  padding: 35px 0 10px 0;
}

#wrapper.not-empty {
  min-height: 40px;
  padding: 35px 0 10px 0;
}

#wrapper.empty {
  min-height: 40px;
  padding: 0;
}

#wrapper.hide {
  padding: 11px 0 10px 0;
}

#files-wrapper {
  margin: 20px 0 10px 0;
  position: relative;
  max-width: 100%;
}

#files-wrapper.embeded {
  height: auto;
  margin: 0;
  padding: 0;
}

#files {
  margin: auto;
  position: relative;
  width: calc(100% - 20px);
}

#add-file-button {
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
  position: absolute;
  right: 12px;
  top: 23px;
  width: 20px;
}

#add-file-button:hover {
  background-color: var(--main-hover-color);
}

#add-file-button:active {
  background-color: var(--main-active-color);
}

#icon-add {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  font-size: 18px;
  margin: auto;
  text-align: center;
}

.file {
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  margin: 0;
  max-width: 100%;
  padding: 0 6px;
  position: relative;
  flex-direction: column;
}

.file-info {
  display: flex;
  padding: 6px 0;
  text-transform: uppercase;
  width: calc(100% - 50px);
}

.file-name {
  align-self: center;
  color: var(--main-text-color);
  display: block;
  font-size: var(--main-accent-font-size);
  line-height: 1;
  margin: 0 0 0 8px;
  max-width: 480px;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file:hover {
  background-color: var(--main-hover-color);
}

.file:active {
  background-color: var(--main-active-color);
}

.thumbnail {
  align-self: center;
  border-radius: 6px;
  display: flex;
  flex-shrink: 0;
  height: 26px;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 26px;
}

.letter {
  align-self: center;
  color: var(--main-body-bg-color);
  display: flex;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  margin: auto;
  position: absolute;
  text-transform: capitalize;
}

.button-action {
  bottom: 0;
  margin: auto;
  max-height: 24px;
  position: absolute !important;
  right: 6px;
  top: 0;
  z-index: 2;
}


#input-error-message,
#input-helper-message {
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding: 5px 0 0 10px;
  position: relative;
  text-transform: uppercase;
}

#input-error-message {
  color: var(--main-color-error);
}

#input-helper-message {
  color: var(--main-secondary-text-color);
}

.type {
  display: flex;
  gap: 5px;
}

</style>
