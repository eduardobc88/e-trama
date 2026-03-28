<template lang="html">
  <div
    id="input-wrapper"
    v-bind:class="{
      focus: hasFocus,
      'no-empty': hasText,
      error: errorMessage,
    }">
    <label
      id="input-title"
      v-bind:class="{ 'error': errorMessage }">
      {{ $t(inputName) }}
      <span
        v-if="inputValueInLabel"
        id="input-value-label">
        {{ inputValueInLabel }}
      </span>
    </label>
    <textarea
      v-bind:type="inputType"
      v-on:focus="focus"
      v-on:blur="focus"
      v-model="value"
      v-bind:disabled="disabled"
      autocomplete="new-password"
      v-on:keyup.enter="getOnKeyupEnter"
      rows="5">
    </textarea>
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
      type: Boolean,
      default: false,
    },
    helperMessage: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    onKeyupEnter: {
      type: String,
      default: () => {},
    },
    inputValueInLabel: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      hasFocus: false,
      hasText: false,
    }
  },
  computed: {
    value: {
      get() {
        this.hasText = false
        if (this.inputValue) this.hasText = true
        return this.inputValue
      },
      set(newVal) {
        this.onChangeValue(this.propName, newVal)
      },
    },
  },
  methods: {
    focus () {
      if (this.hasFocus) {
        this.hasFocus = false
        return
      }
      this.hasFocus = true
    },
    getOnKeyupEnter () {
      if (!this.onKeyupEnter)
        return

      this.onKeyupEnter()
    },
  },
}
</script>

<style scoped lang="css">
#input-wrapper {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  margin: 10px 0;
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
  padding: 0 4px;
  pointer-events: none;
  position: absolute;
  text-transform: uppercase;
  top: 22px;
  transition-duration: 100ms;
}

#input-title.body {
  background-color: transparent;
}

#input-wrapper textarea {
  background-color: var(--main-input-bkg-color);
  border-radius: 8px;
  border: 1px solid var(--main-border-color);
  box-sizing: border-box;
  caret-color: var(--main-accent-color);
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  margin: 0;
  outline: none;
  padding: 8px 10px 2px 10px;
  width: 100%;
}

#input-wrapper textarea:focus {
  border: 1px solid var(--main-accent-color);
}

#input-wrapper.no-empty #input-title {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  padding: 0 20px;
  top: 6px;
}

#input-wrapper.focus #input-title {
  color: var(--main-accent-color);
  font-size: var(--main-secundary-font-size);
  padding: 0 20px;
  top: 6px;
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

#input-wrapper.no-empty.error #input-title,
#input-wrapper.error #input-title,
.error #input-title {
  color: var(--main-color-error);
}

#input-wrapper.error textarea {
  border-color: var(--main-color-error);
}

#input-wrapper input.remove-bottom-border-radius {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

#input-wrapper.embeded {
  margin: 0;
  padding: 0;
}

</style>
