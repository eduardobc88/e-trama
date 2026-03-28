<template lang="html">
  <div id="modal-box-wrapper">
    <div id="modal-box-content">
      <div id="modal-title">
        {{ $t(modalTitle) }}
      </div>
      <p id="modal-description">
        {{ $t(modalDescription) }}
      </p>
      <div id="content-wrapper">
        <div
          class="item"
          v-for="(item, index) of checkboxValues">
          <Checkbox
            v-bind:label="item.name"
            v-bind:onChangeValue="onChangeValue"
            v-bind:item="index"
            v-bind:currentValue="item.value"/>
        </div>
      </div>
      <div id="modal-buttons-wrapper">
        <Button buttonIcon="clear" v-bind:buttonAction="cancelAction">
          {{ $t('cancel') }}
        </Button>
        <Button
          buttonIcon="done"
          v-bind:buttonAction="onAcceptAction"
          style="margin-left: 5px;">
          {{ $t('accept') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'
import Checkbox from './checkbox.vue'

export default {
  props: [
    'modalTitle',
    'modalDescription',
    'cancelAction',
    'acceptAction',
    'checkboxNames', // object array [{ name: ''. value: true|false }]
  ],
  data () {
    return {
      checkboxValues: this.checkboxNames,
    }
  },
  watch: {
    checkboxNames (newVal, oldVal) {
      this.checkboxValues = newVal
    },
  },
  components: {
    Button,
    Checkbox,
  },
  methods: {
    onChangeValue (propName, value, index) {
      this.checkboxValues[index].value = value
    },
    onAcceptAction () {
      this.acceptAction(this.checkboxValues)
    },
  }
}
</script>

<style scoped lang="css">
#modal-box-wrapper {
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

#modal-box-content {
  align-self: center;
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  box-shadow: var(--main-box-shadow);
  margin: auto;
  max-height: 300px;
  max-width: 500px;
  padding: 10px;
  position: relative;
  width: calc(100% - 40px);
}

#modal-title {
  color: var(--main-accent-color);
  font-size: calc(var(--main-accent-font-size) + 4px);
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
}

#modal-description {
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0px;
  margin: 0 0 10px 0;
  text-transform: uppercase;
}

#modal-buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 0px;
  right: 0;
}

#modal-buttons-wrapper .button {
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
  padding: 7px;
  position: relative;
  right: 0;
  text-transform: uppercase;
}

#modal-buttons-wrapper .button:last-child {
  color: var(--main-accent-color);
  margin-left: 10px;
}

#modal-buttons-wrapper .button:hover {
  background-color: var(--main-hover-color);
}

#content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.item {

}

.item-name {
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-font-size);
  font-weight: 600;
  justify-content: center;
  margin: 5px 0px;
}
</style>
