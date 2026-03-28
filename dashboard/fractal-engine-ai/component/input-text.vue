<template lang="html">
  <div
    v-bind:class="{
      'input-wrapper': true,
      focus: hasFocus,
      'no-empty': hasText,
      'error': errorMessage,
      'embeded': isEmbeded,
    }">
    <label
      id="input-title"
      v-bind:class="{
        body: !!isOverBody,
      }">
      {{ $t(inputName) }}
    </label>
    <input
      v-bind:type="inputType"
      v-on:focus="focus"
      v-on:blur="focus"
      v-model="value"
      v-bind:disabled="((disabled !== 'false')?true:false)"
      v-on:keyup.enter="getOnKeyupEnter"
      v-bind:class="{
        'remove-bottom-border-radius': isEmbededDropdown,
      }"
      ref="inputEl"
      spellcheck="false"
      autocomplete="new-password"
      autocorrect="off"
      autocapitalize="off"
      v-bind:maxlength="maxLength"
      v-bind:readonly="readOnly"/>
    <label
      v-show="errorMessage"
      id="input-error-message">
      {{ $t(errorMessage) }}
    </label>
    <label
      v-show="!errorMessage"
      id="input-helper-message">
      {{ $t(helperMessage) }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    inputValue: {
      type: String,
      default: '',
    },
    inputName: {
      type: String,
      default: '',
    },
    onChangeValue: {
      type: Function,
      default: () => {},
    },
    inputType: {
      type: String,
      default: 'text',
    },
    propName: {
      type: String,
      default: '',
    },
    disabled: {
      type: String,
      default: 'false',
    },
    helperMessage: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    data : {
      type: Object,
      default: {},
    },
    isEmbededDropdown: {
      type: Boolean,
      default: false,
    },
    isEmbeded: {
      type: Boolean,
      default: false,
    },
    onKeyupEnter: {
      type: Function,
      default: () => {},
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    isOverBody: {
      type: Boolean,
      default: false,
    },
    onFocus: {
      type: Function,
      default: () => {},
    },
    maxLength: {
      type: Number,
    },
    numberLength: {
      type: Number,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      currentValue: '',
      hasFocus: false,
      hasText: false,
    }
  },
  created () {
    this.currentValue = this.inputValue
  },
  mounted () {
    if (this.autoFocus)
      setInterval(this.inputAutoFocus, 300)
  },
  computed: {
    value: {
      set (newVal) {
        this.currentValue = newVal
        if (this.numberLength !== undefined && newVal.length > parseInt(this.numberLength))
          this.currentValue = newVal.toString().substr(0, 5)
        this.onChangeValue(this.propName, this.currentValue, this.data)
      },
      get () {
        this.hasText = false
        if (this.currentValue !== '')
          this.hasText = true
        return this.currentValue
      },
    },
  },
  watch: {
    inputValue (newVal, oldVal) {
      this.currentValue = this.inputValue
      this.uuid = this.$uuid.v1()
    },
  },
  methods: {
    inputAutoFocus () {
      this.$refs['inputEl'].focus()
    },
    focus () {
      if (this.hasFocus)
        this.hasFocus = false
      else
        this.hasFocus = true
      if (this.onFocus !== undefined)
        this.onFocus(this.hasFocus)
    },
    getOnKeyupEnter () {
      if (!this.onKeyupEnter)
        return

      this.onKeyupEnter(this.currentValue)
    },
  },
}
</script>

<style scoped lang="css">
.input-wrapper {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  margin: 0;
  max-width: 480px;
  padding-top: 15px;
  position: relative;
  width: 100%;
}

#input-title {
  background-color: var(--main-box-bg-color);
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 700;
  left: 10px;
  padding: 0px;
  pointer-events: none;
  position: absolute;
  text-transform: uppercase;
  top: 25px;
  transition-duration: 100ms;
  border-radius: 10px;
}

#input-title.body {
  background-color: var(--main-body-bg-color);
}

.input-wrapper input {
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid var(--main-border-color);
  box-sizing: border-box;
  caret-color: var(--main-accent-color);
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  margin: 0;
  outline: none;
  padding: 8px 10px;
  width: 100%;
}

.input-wrapper.no-empty #input-title {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  padding: 0 20px;
  top: 6px;
}

.input-wrapper.focus #input-title {
  color: var(--main-accent-color);
  font-size: var(--main-secundary-font-size);
  padding: 0 20px;
  top: 6px;
}

.input-wrapper.focus input {
  border: 1px solid var(--main-accent-color);
}

#input-error-message,
#input-helper-message {
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding: 5px 0 0 10px;
  position: relative;
  text-transform: uppercase;
}

#input-error-message {
  color: var(--main-color-error);
}

#input-helper-message {
  color: var(--main-secondary-text-color);
}

.error #input-title {
  color: var(--main-color-error);
}

.error input {
  border: 1px solid var(--main-color-error);
}

.input-wrapper input.remove-bottom-border-radius {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.input-wrapper.embeded {
  margin: 0;
  padding: 0;
}

</style>
