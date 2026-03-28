<template lang="html">
  <div
    class="modal-box-wrapper">
    <div
      class="box-content">
      <div
        class="thumbnail"
        v-bind:style="getFileImageURL(model.get('file_name'), model.get('title'))">
        <div
          class="thumbnail-bkg"></div>
        <div
          class="title">
          {{ $t(model.get('title')) }}
        </div>
      </div>
      <perfect-scrollbar
        class="scroll-area">
        <div
          id="content">
          <MDEditor
            v-bind:content="{
              update: false,
              content: model.get('content'),
            }"/>
        </div>
      </perfect-scrollbar>
      <div
        class="buttons-wrapper">
        <p>
          {{ $t('attachments') }}
        </p>
        <div
          v-if="fileCollection.getModels().length"
          id="attachments">
          <template
            v-for="(a, i) of fileCollection.getModels()">
            <div
              v-on:click="openfile(a)"
              class="attachment"
              v-bind:style="getFileImageURL(a.get('file_name'), a.get('title'))">
              <div
                class="bkg"></div>
              <p>
                {{ a.get('file_name')[0] }}
              </p>
            </div>
          </template>
        </div>
        <Button
          buttonIcon="done"
          v-bind:buttonAction="acceptAction"
          style="margin-left: 5px;">
          {{ $t('accept') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'
import MDEditor from './md-editor.vue'

export default {
  props: [
    'model',
    'acceptAction',
  ],
  data () {
    return {
      fileCollection: new this.$model.FileMC.collection(),
    }
  },
  components: {
    Button,
    MDEditor,
  },
  created () {
    let fileIds = this.model.get('file_ids')
    if (fileIds !== '')
      this.getAttachments()
  },
  methods: {
    getAttachments () {
      this.fileCollection.clear()
      this.fileCollection = null
      this.fileCollection = new this.$model.FileMC.collection()
      let items = this.model.get('file_ids')
      for (let id of items)
        if (id !== '')
          this.addFileToCollection(id)
    },
    async addFileToCollection (id) {
      let newFile = new this.$model.FileMC.model({
        id: id,
      })
      this.fileCollection.add(newFile)
      try {
        await newFile.fetch()
      } catch (err) {
        console.error('== error -> addFileToCollection ==', err)
      }
    },
    getFileImageURL (fileName, title) {
      if (fileName !== undefined && fileName !== null && fileName !== '')
        return this.$getImageURL(fileName, null, '600x200')

      return this.$getHexColor(title, false, 50, 75, 100)
    },
    openfile (file) {
      let fileURL = file.getFileURL()
      window.open(fileURL, '_blank')
    },
  },
}
</script>

<style scoped lang="css">

.modal-box-wrapper {
  background: var(--main-notification-bkg);
  bottom: 0;
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

.box-content {
  align-self: center;
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  margin: auto;
  max-height: 468px;
  max-width: 920px;
  overflow: hidden;
  padding: 75px 6px 6px 6px;
  position: relative;
  width: calc(100% - 12px);
}

.title {
  color: var(--main-accent-color);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
  text-align: center;
  padding: 10px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 1;
}

.box-content #content {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0px;
  text-transform: uppercase;
  max-height: 280px;
}

.buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 6px 0 0 0;
  right: 0;
}

.buttons-wrapper .button {
  background: transparent;
  border-radius: 10px;
  border: none;
  color: #000;
  color: #444;
  cursor: pointer;
  display: block;
  font-size: var(--main-font-size);
  font-weight: 600;
  outline: none;
  padding: 10px 15px;
  position: relative;
  right: 0;
  text-transform: uppercase;
}

.buttons-wrapper .button:last-child {
  color: var(--main-accent-color);
  margin-left: 10px;
}

.attachment:hover > .bkg {
  background-color: var(--main-accent-color);
}

.attachment:hover > p {
  color: #ffffff;
}

.thumbnail {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 75px;
}

.thumbnail-bkg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 75px;
  background-color: rgba(255, 255, 255, 0.85);
}


#attachments {
  display: flex;
  gap: 3px;
}

#attachments .attachment {
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  box-shadow: var(--main-box-shadow);
  border: 1px solid #ddd;
}

.attachment > .bkg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition-duration: 100ms;
  background-color: rgba(255, 255, 255, 0.85);
}

.attachment > p {
  color: var(--main-text-color);
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
  margin: auto;
  position: relative;
  z-index: 1;
}

.buttons-wrapper > p {
  font-size: var(--main-accent-font-size);
  color: var(--main-accent-color);
  text-transform: uppercase;
  margin: auto;
  font-weight: 600;
}

</style>
