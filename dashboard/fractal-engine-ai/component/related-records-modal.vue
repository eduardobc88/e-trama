<template lang="html">
  <div id="modal-box-wrapper">
    <div id="position-wrapper">
      <LoadingBar
        v-if="isLoading"/>
      <div id="modal-box-content">
        <div id="title">
          <div id="modal-title">
            {{ $t(title) }}
          </div>
          <p id="modal-description">
            {{ $t(description) }}
          </p>
        </div>
        <div id="search">
          <FormSearchDropdownSelect
            title="search document"
            helpMsg="use folio or subject"
            v-bind:collection="documentCollection"
            v-bind:onSelectOption="onSelect"
            propNameToShow="search_show"/>
        </div>
        <div
          id="content"
          v-if="collection.getModels().length">
          <perfect-scrollbar id="scrollbar">
            <div
              v-for="(model) in collection.getModels()"
              v-bind:class="{
                'file': true,
                'remove': model.get('remove'),
              }">
              <div
                class="document-info"
                v-on:click="onClickRow(model)">
                <div
                  class="thumbnail"
                  v-bind:style="getStyles(model)">
                  <i class="letter">
                    {{ model.get('subject')[0] }}
                  </i>
                </div>
                <div class="info">
                  <div class="top">
                    <p class="document-name">
                      {{ model.get('related_record_id') }} |
                      {{ model.get('folio') }} |
                      {{ model.get('document_folio') }}
                    </p>
                  </div>
                  <div class="bottom subject">
                    {{ model.get('subject') }}
                  </div>
                </div>
              </div>
              <ButtonIcon
                v-if="!model.get('remove')"
                class="button-action"
                buttonIcon="cancel"
                v-bind:buttonAction="onClickToRemove"
                v-bind:buttonData="model"/>
              <ButtonIcon
                v-if="model.get('remove')"
                class="button-action"
                buttonIcon="add"
                v-bind:buttonAction="onClickToAdd"
                v-bind:buttonData="model"/>
            </div>
          </perfect-scrollbar>
        </div>
        <div id="footer">
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
import FormSearchDropdownSelect from './form-search-dropdown-select.vue'

export default {
  props: [
    'title',
    'description',
    'onClose',
    'onSelect',
    'collection',
    'onClickRemove',
    'onClickAdd',
    'isLoading',
  ],
  data () {
    return {
      documentCollection: new this.$model.DocumentMC.collection(),
    }
  },
  components: {
    Button,
    LoadingBar,
    ButtonIcon,
    FormSearchDropdownSelect,
  },
  methods: {
    onSelectFile (data) {
      this.closeLibraryModal()
      this.onSelect(data)
    },
    getStyles (model) {
      let folio = model.get('folio')
      return this.$getHexColor(folio)
    },
    onClickRow (model) {
      this.router.push({
        name: 'document',
        params: {
          id: model.get('related_record_id'),
        },
      })
      this.onClose()
    },
    onClickToRemove (model) {
      this.onClickRemove(model)
    },
    onClickToAdd (model) {
      this.onClickAdd(model)
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

#search {
  padding: 10px;
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

.document-info {
  display: flex;
  padding: 4px 0;
  width: calc(100% - 50px);
}

.document-name {
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

.subject {
  color: var(--main-text-color);
  font-size: var(--main-accent-font-size);
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

.file:active .document-name {
  color: var(--main-text-color);
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
