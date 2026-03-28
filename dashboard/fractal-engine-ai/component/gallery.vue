<template lang="html">
  <div id="wrapper">
    <div id="header">
      <div class="inline-wrapper">
        <div class="left column">
          <h2>
            {{ $t(title) }}
          </h2>
          <p id="description">
            {{ $t(description) }}
          </p>
        </div>
        <div class="right justify-right">
          <ButtonIcon
            v-if="showAddItem"
            buttonIcon="add"
            v-bind:buttonAction="openFileModal"/>
        </div>
      </div>
    </div>
    <perfect-scrollbar class="scroll-area">
      <div id="items-wrapper">
        <template v-for="(item, key) of collection.getModels()">
          <div
            v-if="!item.remove"
            class="inline-wrapper item">
            <div class="left width-32">
              <div
                class="image"
                v-bind:style="getCoverImage(item)">
              </div>
            </div>
            <div class="middle">
              <i class="letter" v-if="!item.get('file_title')">
                {{ item.get('file_title')[0] }}
              </i>
              <p class="title">
                {{ item.get('file_title') }}
              </p>
            </div>
            <div class="right justify-right">
              <ButtonIcon
                buttonIcon="visibility"
                v-bind:buttonData="item"
                v-bind:buttonAction="onClickShowItem"/>
              <ButtonIcon
                buttonIcon="delete"
                v-bind:buttonData="item"
                v-bind:buttonAction="onClickRemoveItem"/>
            </div>
          </div>
        </template>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
// <Gallery
//   title="test"
//   description="aiojd"
//   v-bind:onlyImages="false"
//   v-bind:collection="attachments"
//   v-bind:maxItems="10"/>
// attachments: new this.$model.FileMC.collection(),

import Button from './button.vue'
import ButtonIcon from './button-icon.vue'

export default {
  props: [
    'title',
    'description',
    'onRemoveItem',
    'onClickItem',
    'onlyImages',
    'collection',
    'maxItems',
  ],
  data () {
    return {
      showAddItem: true,
      fileModalData: {
        onlyImages: true,
        modalTitle: 'set featured image',
        modalDescription: 'chose one image or upload new',
        closeFileModal: this.closeFileModal,
        onFileSelect: this.onFileSelect,
      },
    }
  },
  updated () {
    this.showAddItem = this.isMaxItems()
  },
  components: {
    Button,
    ButtonIcon,
  },
  methods: {
    openFileModal () {
      this.$emitter.emit('file-modal', this.fileModalData)
    },
    closeFileModal () {
      this.$emitter.emit('file-modal', null)
    },
    onFileSelect (file) {
      this.collection.add({
        id: 0,
        file_id: file.get('id'),
        file_name: file.get('file_name'),
        file_title: file.get('file_title'),
        remove: false,
      })
      this.closeFileModal()
    },
    getCoverImage (item) {
      if (item.get('file_name'))
        return this.$getAvatarURL(item.get('file_name'))

      return this.$getHexColor(item.get('file_name'))
    },
    isMaxItems () {
      if (this.collection.getModels().length < parseInt(this.maxItems))
        return true

      return false
    },
    onClickShowItem (item) {
      let fileURL = item.getFileURL()
      window.open(fileURL, '_blank')
      if (this.onClickItem !== undefined)
        this.onClickItem(item)
    },
    onClickRemoveItem (item) {
      item.set('remove', true)
      if (item.get('id') === 0)
        this.collection.remove(item)
      if (this.onRemoveItem !== undefined)
        this.onRemoveItem(item)
    },
  },
}
</script>

<style scoped lang="css">

#wrapper {
  margin: 0 0 35px 0;
  position: relative;
  width: 100%;
  max-width: 480px;
}

h2 {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 700;
  margin-bottom: 5px;
  padding: 0 6px;
  text-transform: uppercase;
}

#description {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 600;
  margin-top: 0px;
  padding: 0 6px;
  text-transform: uppercase;
}

#items-wrapper {
  display: flex;
  flex-wrap: wrap;
  max-height: 200px;
  width: 100%;
}

.image {
  background-position: center center;
  background-size: cover;
  border-radius: 10px;
  margin: 1px;
  display: flex;
  height: 32px;
  overflow: hidden;
  position: relative;
  width: 32px;
  cursor: pointer;
}

.image .letter {
  align-self: center;
  color: white;
  display: flex;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  margin: auto;
  text-transform: uppercase;
}


.inline-wrapper {
  border-radius: 10px;
  display: inline-flex;
  height: 40px;
  margin: 2px 0;
  padding: 2px 6px;
  width: calc(100% - 12px);
}

.inline-wrapper .left,
.inline-wrapper .middle,
.inline-wrapper .right {
  align-self: center;
  display: flex;
  width: 100%;
}


.inline-wrapper .middle {
  width: calc(100% - 100px);
}

.left.column {
  flex-direction: column;
}

.left.width-32 {
  width: 34px;
}

.justify-right {
  justify-content: right;
}

.title {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  padding: 0 6px;
  text-overflow: ellipsis;
  text-transform: uppercase;
  width: 220px;
}

.inline-wrapper:nth-child(even) {
  background-color: var(--main-table-bg-row);
}


.inline-wrapper.item:hover {
  background-color: var(--main-hover-color);
}

.inline-wrapper.item:active {
  background-color: var(--main-active-color);
}

.scroll-area {
  padding: 10px;
}

</style>
