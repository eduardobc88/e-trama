<template lang="html">
  <div
    id="ribbon-wrapper"
    v-bind:class="{
      success: ((type === 'success')?true:false),
      error: ((type === 'error')?true:false),
    }">
    <div>
      <p>
        {{ $t(title) }}
      </p>
      <div id="message">
        {{ $t(message) }}
      </div>
    </div>
    <div id="buttons">
      <ButtonIcon
        v-bind:buttonIcon="'visibility'"
        v-bind:buttonAction="showRibbonMessage"/>
      <ButtonIcon
        v-bind:buttonIcon="'close'"
        v-bind:buttonAction="removeRibbonMessage"/>
    </div>
  </div>
</template>

<script>
import ButtonIcon from './button-icon.vue'

export default {
  components: {
    ButtonIcon,
  },
  props: {
    onClickCloseAction: {
      type: Function,
      default: () => {},
    },
    type: {
      type: String,
      default: '',
    },
    data: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      confirmationModalData: {
        modalTitle: '',
        modalDescription: '',
        acceptAction: this.acceptAction,
      },
    }
  },
  created () {},
  methods: {
    showRibbonMessage () {
      this.confirmationModalData.modalTitle = this.title
      this.confirmationModalData.modalDescription = this.message
      this.$emitter.emit('confirmation-modal', this.confirmationModalData)
    },
    acceptAction () {
      this.$emitter.emit('confirmation-modal', null)
    },
    removeRibbonMessage () {
      this.onClickCloseAction(this.data)
    },
  },
}
</script>

<style scoped lang="css">

#ribbon-wrapper {
  -webkit-user-select: none;
  align-items: center;
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  color: var(--main-text-color);
  display: flex;
  flex-direction: column;
  font-size: var(--main-font-size);
  font-weight: 600;
  line-height: 1;
  margin: 10px;
  overflow: hidden;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  user-select: none;
  width: 300px;
  z-index: 2;
}

#ribbon-wrapper > div {
  width: 100%;
}

#ribbon-wrapper p:first-child {
  font-weight: 700;
  padding: 0 10px;
  text-align: left;
  margin: 10px 0 5px 0;
  color: var(--main-text-color);
}

#ribbon-wrapper #message {
  -webkit-box-orient: vertical;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  color: var(--main-secondary-text-color);
  display: -webkit-box;
  font-weight: 500;
  margin: 5px 0 10px 0;
  overflow: hidden;
  padding: 0 10px;
  text-align: left;
  text-overflow: ellipsis;
}

#buttons {
  display: flex;
  gap: 5px;
  justify-content: end;
  margin: 0 20px 10px 0;
}

#ribbon-wrapper.success {
  background-color: var(--main-success-bkg);
}

#ribbon-wrapper.error {
  background-color: var(--main-error-bkg);
}

#ribbon-wrapper.warning {
  background-color: var(--main-warning-bkg);
}

</style>
