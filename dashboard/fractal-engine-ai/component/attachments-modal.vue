<template lang="html">
  <div id="modal-box-wrapper">
    <div id="position-wrapper">
      <!-- <LoadingBar v-bind:isLoading="isLoading"/> -->
      <div id="modal-box-content">
        <div id="title">
          <div id="modal-title">
            {{ $t(modalTitle) }}
          </div>
          <p id="modal-description">
            {{ $t(modalDescription) }}
          </p>
        </div>
        <div
          id="content"
          v-if="attachments.getModels().length">
          <perfect-scrollbar id="scrollbar">
            <div
              v-for="(file) in attachments.getModels()"
              v-bind:class="{
                'file': true,
                'remove': file.get('remove')
                }">
              <div
                class="file-info"
                v-on:click="onFileClick(file)">
                <div
                  class="thumbnail"
                  v-bind:style="getStyles(file)">
                  <i class="letter">
                    {{ getLetterFromFileName(file) }}
                  </i>
                </div>
                <p class="file-name">
                  {{ file.get('file_original_name') }} |
                  {{ file.get('file_mime_type') }}
                </p>
              </div>
              <ButtonIcon
                v-if="!file.get('remove')"
                class="button-action"
                buttonIcon="cancel"
                v-bind:buttonAction="onClickToRemove"
                v-bind:buttonData="file"/>
              <ButtonIcon
                v-if="file.get('remove')"
                class="button-action"
                buttonIcon="add"
                v-bind:buttonAction="onClickToAdd"
                v-bind:buttonData="file"/>
            </div>
          </perfect-scrollbar>
        </div>
        <div id="footer">
          <Button
            buttonIcon="add"
            v-bind:buttonAction="openLibraryModal">
            {{ $t('new') }}
          </Button>
          <Button
            buttonIcon="done"
            v-bind:buttonAction="this.onClose">
            {{ $t('accept') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'
import LoadingBar from './loading-bar.vue'
import ButtonIcon from './button-icon.vue'

export default {
  props: [
    'modalTitle',
    'modalDescription',
    'onClose',
    'onSelectAttachment',
    'attachments',
    'onClickRemoveAttachment',
    'onClickAddAttachment',
    'isLoading',
  ],
  data () {
    return {
      libraryModalData: {
        onlyImages: false,
        modalTitle: 'all files',
        modalDescription: 'chose one file or upload new',
        closeFileModal: this.closeLibraryModal,
        onFileSelect: this.onSelectFile,
      },
    }
  },
  components: {
    Button,
    LoadingBar,
    ButtonIcon,
  },
  methods: {
    openLibraryModal () {
      this.$emitter.emit('file-modal', this.libraryModalData)
    },
    closeLibraryModal () {
      this.$emitter.emit('file-modal', null)
    },
    onSelectFile (data) {
      this.closeLibraryModal()
      this.onSelectAttachment(data)
    },
    getStyles (file) {
      let fileOriginalName = file.get('file_original_name')
      let isImage = this.$isImage(fileOriginalName)
      if (!isImage)
        return this.$getHexColor(fileOriginalName)

      let fileName = file.get('file_name')
      return this.$getAvatarURL(fileName)
    },
    getLetterFromFileName (file) {
      let fileOriginalName = file.get('file_original_name')[0]
      let fileName = file.get('file_name')
      let isImage = this.$isImage(fileName)
      if (!isImage)
        return fileOriginalName

      return ''
    },
    onFileClick (file) {
      let fileURL = file.getFileURL()
      window.open(fileURL, '_blank')
    },
    onClickToRemove (file) {
      this.onClickRemoveAttachment(file)
    },
    onClickToAdd (file) {
      this.onClickAddAttachment(file)
    },
  },
}
</script>

<style scoped lang="css">
h2 {
  color: var(--main-accent-color);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1;
  margin: 0;
  padding: 0;
}

#modal-description {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 20px;
  margin-bottom: 5px;
  margin-top: 0;
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
  z-index: 4;
}

#position-wrapper {
  box-sizing: border-box;
  margin: auto;
  max-width: 1145px;
  padding: 10px;
  position: relative;
  width: 100%;
}

#modal-box-content {
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  box-shadow: var(--main-box-shadow);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 480px;
  margin: auto;
  overflow: hidden;
  position: relative;
  transition-duration: 100ms;
  width: 100%;
}

#scrollbar {
  flex-grow: 1;
}

#content {
  height: 100%;
  position: relative;
  padding: 6px 6px 0 6px;
}

#footer {
  box-sizing: border-box;
  display: flex;
  flex-grow: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin: 10px 0 0 0;
  padding: 0px 6px 6px 6px;
  width: 100%;
}

#footer div {
  margin-left: 5px;
}


.file {
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  margin: 0;
  max-width: 100%;
  padding: 0 10px;
  position: relative;
}

.file:nth-child(even) {
  background-color: var(--main-table-bg-row);
}

.file.remove {
  background-color: var(--main-red-color);
}

.file-info {
  display: flex;
  padding: 4px 0;
  width: calc(100% - 50px);
}

.file-name {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-font-size);
  line-height: 1;
  margin: 0 0 0 8px;
  position: relative;
  text-overflow: ellipsis;
  text-transform: uppercase;
}

.file:hover {
  background-color: var(--main-hover-color);
}

.file:active {
  background-color: var(--main-active-color);
}

.file:active .file-name {
  color: var(--main-active-color);
}

.thumbnail {
  align-self: center;
  border-radius: 10px;
  display: flex;
  flex-shrink: 0;
  height: 24px;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 24px;
}

.letter {
  align-self: center;
  color: #ffffff;
  display: flex;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  margin: auto;
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

#modal-title {
  color: var(--main-accent-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
}

#modal-description {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0px;
  text-transform: uppercase;
}

#title {
  padding: 6px 6px 0 6px;
}

.ps {
  height: calc(100% - 50px);
}

</style>
