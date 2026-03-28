<template>
  <div id="modal-box-wrapper">
    <div id="box-content">
      <SectionHeader
        v-bind:sectionTitle="modalTitle"
        v-bind:sectionDescription="modalDescription"
        customPaddingStyle="0 6px"
        customMarginStyle="6px 0"
        v-bind:highlight="true"
        v-bind:expanded="true"/>
      <div id="content">
        <InputText
          v-bind:inputName="inputName"
          v-bind:inputValue="inputValue"
          v-bind:onChangeValue="onChangeInputValue"
          propName=""
          v-bind:errorMessage="errorMessage"
          v-bind:helperMessage="helperMessage"/>
        <div class="buttons-wrapper">
          <Button
            v-if="modalCancel"
            buttonIcon="clear"
            v-bind:buttonAction="modalCancel">
            {{ $t('cancel') }}
          </Button>
          <Button
            buttonIcon="done"
            v-bind:buttonAction="onAccept"
            style="margin-left: 4px;">
            {{ $t('accept') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'
import SectionHeader from './section-header.vue'
import InputText from './input-text.vue'

export default {
  props: [
    'modalTitle',
    'modalDescription',
    'inputName',
    'modalCancel',
    'modalAccept',
    'helperMessage',
  ],
  components: {
    Button,
    SectionHeader,
    InputText,
  },
  data () {
    return {
      inputValue: '',
      errorMessage: '',
    }
  },
  methods: {
    onChangeInputValue (propName, value) {
      if (value === '') {
        this.errorMessage = 'required'
        return
      }
      this.errorMessage = ''
      this.inputValue = value
    },
    onAccept () {
      if (this.errorMessage !== '')
        return

      if (this.inputValue === '') {
        this.errorMessage = 'required'
        return
      }
      this.modalAccept(this.inputValue)
    },
  },
}
</script>

<style scoped lang="css">
#modal-box-wrapper {
  bottom: 0;
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 10;
  background-color: var(--main-notification-bkg);
}

#box-content {
  align-self: center;
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  margin: auto;
  max-height: 300px;
  max-width: 480px;
  overflow: hidden;
  position: relative;
  transition-duration: 100ms;
  width: calc(100% - 32px);
}

#content {
  overflow: hidden;
  padding: 10px;
}

.buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 0;
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
  padding: 2px 15px;
  position: relative;
  right: 0;
  text-transform: capitalize;
}

.buttons-wrapper .button:last-child {
  color: var(--main-accent-color);
  margin-left: 10px;
}

.buttons-wrapper .button:hover {
  background-color: var(--main-accent-opace-color);
}
</style>
