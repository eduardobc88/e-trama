<template lang="html">
  <div class="modal-box-wrapper">
    <div class="box-content">
      <div class="title">
        {{ $t(modalTitle) }}
      </div>
      <perfect-scrollbar class="scroll-area">
        <div id="content" v-html="modalDescription">
        </div>
      </perfect-scrollbar>
      <div class="buttons-wrapper">
        <Button
          v-if="cancelAction"
          buttonIcon="clear"
          v-bind:buttonAction="cancelAction">
          {{ $t('cancel') }}
        </Button>
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
    'modalTitle',
    'modalDescription',
    'cancelAction',
    'acceptAction',
  ],
  components: {
    Button,
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
  z-index: 10;
}

.box-content {
  align-self: center;
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  margin: auto;
  max-height: 320px;
  max-width: 500px;
  padding: 10px;
  position: relative;
  width: calc(100% - 12px);
}

.title {
  color: var(--main-accent-color);
  font-size: calc(var(--main-accent-font-size) + 4px);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0 0 10px 0;
  text-transform: uppercase;
}

.box-content #content {
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0px;
  text-transform: uppercase;
  max-height: 260px;
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
