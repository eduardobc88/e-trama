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
            v-if="list.length"
            v-for="(item, key) of list">
            <div
              class="key-value">
              <p
                v-on:click="openFile(item['id'])">
                {{ item['title'] }}
              </p>
              <img
                v-bind:src="getImage(item['id'])"/>
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
import APP_SETTINGS from '../app-settings'

export default {
  props: [
    'title',
    'noKeyValues',
    'list',
    'acceptAction',
  ],
  components: {
    Button,
  },
  data () {
    return {
    }
  },
  created () {
    this.setup()
  },
  methods: {
    setup () {

    },
    openFile (id) {
      let fileURL = this.$getGDFileURL(APP_SETTINGS.appApiBaseURL, id, true)
      window.open(fileURL, '_blank')
    },
    getImage (id) {
      let fileURL = this.$getGDFileURL(APP_SETTINGS.appApiBaseURL, id, false)
      console.log(fileURL)
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

.key-value p {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
  padding: 0 4px 0 0;
  cursor: pointer;
  outline: none;
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
