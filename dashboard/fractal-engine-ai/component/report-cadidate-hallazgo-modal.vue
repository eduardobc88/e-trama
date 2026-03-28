<template lang="html">
  <div class="modal-box-wrapper">
    <div class="box-content">
      <div class="title">
        {{ $t(title) }}
      </div>
      <perfect-scrollbar
        class="scroll-area">
        <div
          id="content">
          <ListTable
            v-if="collection !== null && collection.getModels().length"
            v-bind:collection="collection"
            v-bind:onClickRow="noop"
            v-bind:navigationBefore="noop"
            v-bind:navigationNext="noop"
            v-bind:currentPage="1"
            v-bind:totalPages="1"
            v-bind:itemsSkipped="0"
            v-bind:totalItems="collection.getModels().length"
            v-bind:rowButtons="rowButtons"
            v-bind:fileImageKey="fileImageKey"
            v-bind:isLoading="false"
            v-bind:model="model"
            v-bind:modelPrefix="modelPrefix"
            v-bind:modelDefaultProps="modelDefaultProps"
            v-bind:identifier="'id'"
            v-bind:onlyWrapper="false"
            v-bind:isOverBody="false"
            v-bind:hideActions="true"
            v-bind:maxHeight="300"/>
        </div>
      </perfect-scrollbar>
      <div class="buttons-wrapper">
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
import ListTable from  './list-table.vue'

export default {
  props: [
    'title',
    'description',
    'collection',
    'model',
    'acceptAction',
  ],
  components: {
    Button,
    ListTable,
  },
  data () {
    return {
      modelPrefix: 'hallazgo_report',
      fileImageKey: {
        id: 'id',
        letter: 'título',
      },
      modelDefaultProps: [
        'id',
        'título',
        'subject',
        'descripción',
        'microperforado',
        'calca',
        'banderin',
        'bandera',
        'gorra',
        'lona',
        'templete',
        'bolsa',
        'playera',
        'otro',
        'total',
      ],
      rowButtons: [{
        icon: 'perm_media',
        action: this.showGalleryModal,
      }],
      sidebarInfoModalData: {
        title: '',
        noKeyValues: [
          'title',
          'id',
        ],
        list: [],
        acceptAction: this.sidebarInfoModalAcceptAction,
      },
    }
  },
  created () {
    this.setup()
  },
  methods: {
    setup () {

    },
    noop () {

    },
    showGalleryModal (data) {
      data.item.get('attachment_files')
      this.sidebarInfoModalData.title = data.item.get('título')
      this.sidebarInfoModalData.list = []
      let items = []
      for (let i of data.item.get('attachment_files'))
        items.push({
          title: i.file_title,
          id: i.id,
        })
      this.sidebarInfoModalData.list = items
      this.$emitter.emit('sidebar-attachment-info-modal', this.sidebarInfoModalData)
    },
    sidebarInfoModalAcceptAction () {
      this.$emitter.emit('sidebar-attachment-info-modal', null)
    },
  },
}
</script>

<style scoped lang="css">
.modal-box-wrapper {
  background-color: var(--main-notification-bkg);
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
  background-color: var(--main-body-bg-color);
  border-radius: 10px;
  box-shadow: var(--main-box-shadow);
  margin: auto;
  max-width: calc(100% - 100px);
  padding: 10px;
  position: relative;
  width: 100%;
  height: auto;
}

.title {
  color: var(--main-accent-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
}

.key-value {
  display: flex;
  margin: 12px 0;
}

.key-value p:first-child {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
  padding: 0 4px 0 0;
}

.key-value p:last-child {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
}

.key-value p {
  margin: 0;
  padding: 0;
}

.box-content #content {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0px;
  text-transform: uppercase;
}

.buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 0px;
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

.buttons-wrapper .button:hover {
  background-color: var(--main-hover-color);
}
</style>
