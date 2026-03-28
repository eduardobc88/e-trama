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
          <div
            v-if="Object.keys(customKeyValues).length"
            v-for="(value, key) of Object.keys(customKeyValues)">
            <div
              class="key-value">
              <p>
                {{ value }}:
              </p>
              <p>
                {{ customKeyValues[value] }}
              </p>
            </div>
          </div>
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

export default {
  props: [
    'title',
    'noKeyValues',
    'model',
    'cancelAction',
    'acceptAction',
  ],
  components: {
    Button,
  },
  data () {
    return {
      customKeyValues: {},
    }
  },
  created () {
    this.setup()
  },
  methods: {
    setup () {
      for (let key of Object.keys(this.model._attributes)) {
        if (this.noKeyValues.indexOf(key) >= 0)
          continue
        let propName = key.replaceAll('_', ' ').replaceAll('id ref', '')
        this.customKeyValues[propName] = this.model.get(key)
      }
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
  height: 100%;
  margin: auto 0 auto auto;
  max-width: 500px;
  padding: 10px;
  position: relative;
  width: calc(100% - 12px);
}

.title {
  color: var(--main-text-color);
  font-size: calc(var(--main-accent-font-size) + 4px);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0 0 10px 0;
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

.scroll-area {
  height: calc(100% - 56px);
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
