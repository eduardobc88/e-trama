<template lang="html">
  <div
    id="select-wrapper"
    v-bind:class="{
        'open': show,
        'embeded': rowEmbeded,
      }"
    v-click-outside="clickOutsite"
    v-on:click="showOptions">
    <InputText
      :key="`${ propName }_${ currentIndex }`"
      v-bind:inputName="label"
      v-bind:inputValue="getOptionName()"
      v-bind:errorMessage="errorMessage"
      v-bind:helperMessage="helperMessage"
      v-bind:isEmbededDropdown="false"
      v-bind:onFocus="onFocus"
      v-bind:readOnly="true"
      v-bind:onclick="onFocus"/>
    <transition name="dropdown-transition" mode="out-in">
      <div
        id="select-options"
        class="transition-wrapper"
        v-bind:class="{
          focus: focus,
        }"
        v-if="show && !disabled">
        <perfect-scrollbar class="scroll-area">
          <div id="items">
            <div
              class="item"
              v-on:click="onSelectEmpty()">
              {{ $t('none') }}
            </div>
            <div
              class="item"
              v-for="(option, index) in selectOptions"
              v-on:click="onSelect(index)">
              {{ $t(option.name) }}
            </div>
          </div>
        </perfect-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
import InputText from './input-text.vue'

export default {
  props: {
    onSelectOption: {
      type: Function,
      default: () => {},
    },
    selectOptions: {
      type: Array,
      default: [],
    },
    initialIndexOption: {
      type: Number,
      default: -1,
    },
    label: {
      type: String,
      default: '',
    },
    propName: {
      type: String,
      default: '',
    },
    helperMessage: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: {},
    },
    onOpenClose: {
      type: Function,
      default: () => {},
    },
    rowEmbeded: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      currentIndex: 0,
      show: false,
      hasFocus: false,
      focus: false,
    }
  },
  components: {
    InputText,
  },
  watch: {
    initialIndexOption (newVal, oldVal) {
      this.currentIndex = newVal
    },
    show (newVal, oldVal) {
      this.onActions(newVal)
    },
  },
  created () {
    this.currentIndex = this.initialIndexOption
  },
  methods: {
    showOptions () {
      this.hasFocus = true
      this.show = true
    },
    onFocus (value) {
      this.focus = value
      this.hasFocus = true
      this.show = true
    },
    focusout () {
      this.hasFocus = false
      this.show = false
    },
    onSelectEmpty () {
      this.currentIndex = -1
      let option = {
        name: '',
        value: null,
        prop_name: this.propName,
        selected: false,
      }
      this.onSelectOption(option, this.currentIndex, this.propName)
      this.hasFocus = false
      this.show = false
    },
    onSelect (index) {
      this.currentIndex = index
      let option = this.selectOptions[index]
      option.prop_name = this.propName
      this.onSelectOption(option, index, this.data, this.propName)
      this.hasFocus = false
      this.show = false
    },
    clickOutsite (e) {
      this.hasFocus = false
      this.show = false
    },
    getOptionName () {
      let name = this.$t('none')
      if (this.selectOptions.length === 0 || this.currentIndex === null || this.currentIndex < 0)
        return name

      if (this.currentIndex >= 0 && this.selectOptions[this.currentIndex] !== undefined)
        name = this.selectOptions[this.currentIndex].name

      return name
    },
    onActions (isOpen) {
      if (this.onOpenClose !== undefined)
        this.onOpenClose(isOpen)
    },
  },
}
</script>

<style scoped lang="css">
#select-options {
  background-color: var(--main-box-bg-color-op);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom: 1px solid var(--main-active-color);
  border-left: 1px solid var(--main-active-color);
  border-right: 1px solid var(--main-active-color);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 0;
  box-shadow: var(--main-box-shadow);
  left: 0;
  list-style: none;
  margin: 0;
  max-width: 480px;
  overflow: auto;
  position: absolute;
  right: 0;
  top: 45px;
  width: calc(100% - 2px);
  z-index: 2;
}

#select-options.focus {
  border-bottom: 1px solid var(--main-accent-color);
  border-left: 1px solid var(--main-accent-color);
  border-right: 1px solid var(--main-accent-color);
}

.embeded #select-options {
  top: 21px;
}

#select-options .scroll-area {
  max-height: 150px;
}

#select-wrapper {
  background-color: transparent;
  display: block;
  flex-direction: column;
  max-width: 480px;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
}

#select-wrapper.embeded {
  height: auto;
  padding: 0;
}

#input-title {
  background-color: transparent;
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  left: 6px;
  padding: 0 4px;
  pointer-events: none;
  position: absolute;
  text-transform: uppercase;
  top: 4px;
  transition-duration: 50ms;
}

input {
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--main-border-color);
  box-sizing: border-box;
  caret-color: var(--main-accent-color);
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  line-height: 1;
  margin: 0;
  outline: none;
  padding: 3px 0;
  padding: 6px 10px;
  pointer-events: none;
  width: 100%;
}

#select-wrapper.open input {
  border-bottom: 0px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

#select-wrapper .icon {
  font-size: 14px;
  left: 4px;
  line-height: 1;
  position: absolute;
}

#select-options .item {
  background-color: var(--main-box-bg-color-op);
  border-radius: 8px;
  color: var(--main-text-color);
  cursor: pointer;
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  margin: 0px 6px;
  overflow: hidden;
  padding: 8px 10px;
  text-overflow: ellipsis;
  text-transform: uppercase;
}

#select-options .scroll-area {
  padding: 10px 0;
}

#select-options .item:first-letter {
  text-transform: uppercase;
}

#select-options .item:hover {
  background-color: var(--main-hover-color);
}

#select-options .item:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

#select-wrapper.open input {
  border-bottom: 1px solid var(--main-accent-color);
}

#select-wrapper.open #input-title {
  color: var(--main-accent-color);
}

#input-error-message,
#input-helper-message {
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

.input-wrapper #input-title.error {
  color: var(--main-color-error);
}

#empty {
  padding: 10px;
  color: var(--main-text-color);
  font-size: var(--main-font-size);
}
</style>
