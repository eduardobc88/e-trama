<template lang="html">
  <div
    id="button-wrapper"
    v-bind:style="{
      '--btn-bkg-color': this.btnBkgColorL,
      '--btn-bkg-hover-color': this.btnBkgHoverColorL,
      '--btn-bkg-active-color': this.btnBkgActiveColorL,
      '--btn-color': this.btnColorL,
      '--btn-btn-active-color': this.btnActiveColorL,
    }"
    v-bind:class="{
      readonly: readOnly,
      }"
    v-on:click="onClickbutton">
    <i
      v-if="buttonIcon && !rightIcon"
      class="material-symbols-rounded icon">
      {{ buttonIcon }}
    </i>
    <slot></slot>
    <i
      v-if="buttonIcon && rightIcon"
      class="material-symbols-rounded icon">
      {{ buttonIcon }}
    </i>
    <div
      v-if="chipText"
      id="chip">
      <i>
        {{ chipText }}
      </i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buttonIcon: {
      type: String,
      default: '',
    },
    buttonAction: {
      type: Function,
      default: () => {},
    },
    data: {
      type: Object,
      default: {},
    },
    rightIcon: {
      type: String,
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    btnBkgColor: {
      type: String,
      default: '',
    },
    btnBkgHoverColor: {
      type: String,
      default: '',
    },
    btnBkgActiveColor: {
      type: String,
      default: '',
    },
    btnColor: {
      type: String,
      default: '',
    },
    btnActiveColor: {
      type: String,
      default: '',
    },
    chipText: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      btnBkgColorL: 'transparent',
      btnBkgHoverColorL: 'var(--main-hover-color)',
      btnBkgActiveColorL: 'var(--main-active-color)',
      btnColorL: 'var(--main-text-color)',
      btnActiveColorL: 'var(--main-text-color)',
    }
  },
  components: {},
  created () {
    if (this.btnBkgColor)
      this.btnBkgColorL = this.btnBkgColor
    if (this.btnBkgHoverColor)
      this.btnBkgHoverColorL = this.btnBkgHoverColor
    if (this.btnBkgActiveColor)
      this.btnBkgActiveColorL = this.btnBkgActiveColor
    if (this.btnColor)
      this.btnColorL = this.btnColor
    if (this.btnActiveColor)
      this.btnActiveColorL = this.btnActiveColor
  },
  methods: {
    onClickbutton () {
      this.buttonAction(this.data)
    },
  },
}
</script>

<style scoped lang="css">

#button-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background-color: var(--btn-bkg-color);
  border-radius: 10px;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  outline: none;
  padding: 8px 10px;
  position: relative;
  text-transform: uppercase;
  user-select: none;
  word-break: keep-all;
  align-items: center;

  --btn-bkg-color: #ffffff;
  --btn-bkg-hover-color: #ffffff;
  --btn-bkg-active-color: #ffffff;
  --btn-color: #ffffff;
  --btn-btn-active-color: #ffffff;
}

#button-wrapper:hover {
  background-color: var(--btn-bkg-hover-color);
}

#button-wrapper:active {
  background-color: var(--btn-bkg-active-color);
  color: var(--btn-btn-active-color);
}

#button-wrapper .icon {
  font-size: 16px;
  margin-right: 5px;
  align-self: center;
}

#button-wrapper.readonly {
  opacity: 0.5;
}

#chip {
  background-color: var(--main-active-color);
  border-radius: 2px;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  margin: auto auto auto 8px;
  padding: 0 2px;
  position: relative;
  right: 0;
  top: 0;
}

#chip i {
  color: var(--main-text-color);
  font-size: var(--main-accent-font-size);
  font-style: normal;
  font-weight: 600;
  margin: auto;
}

</style>
