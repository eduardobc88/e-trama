<template lang="html">
  <label
    id="input-wrapper"
    v-bind:class="{
      'align-left': isAlignLeft,
      'align-center': isAlignCenter,
      'disabled': disabled,
      'embeded': isEmbeded,
      }">
    <div id="letter-checkbox">
      <TransitionGroup name="openback-transition" mode="out-in">
        <div
          :key="uuid"
          id="letter"
          v-if="!isChecked && letter !== '' && !hasImageId()"
          v-bind:style="getStyles(letter)">
          {{ letter[0] }}
        </div>
        <div
          v-if="!isChecked && hasImageId()"
          class="avatar">
          <File
            v-bind:id="item.get(imgPropName)"
            v-bind:letter="item.get(letter)"
            v-bind:iconSize="'18px'"
            v-bind:letterSize="'16px'"
            v-bind:weight="400"
            v-bind:size="'150x150'"/>
        </div>
      </TransitionGroup>
      <input
        type="checkbox"
        v-on:change="onChange"
        v-bind:class="{
          checked: isChecked,
        }"/>
      <div
        id="checkmark">
        <svg
          v-if="isChecked"
          class="svg"
          focusable="false"
          aria-hidden="true"
          viewBox="4 4 16 16">
          <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z">
          </path>
        </svg>
      </div>
    </div>
    <label v-if="label">
      {{ $t(label) }}
    </label>
  </label>
</template>

<script>
import File from './file.vue'

export default {
  components: {
    File,
  },
  props: {
    onChangeValue: {
      type: Function,
      default: () => {},
    },
    label: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: null,
    },
    currentValue: {
      type: Boolean,
      default: false,
    },
    propName: {
      type: String,
      default: '',
    },
    isAlignLeft: {
      type: Boolean,
      default: false,
    },
    isAlignCenter: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isEmbeded: {
      type: Boolean,
      default: false,
    },
    letter: {
      type: String,
      default: '',
    },
    imgPropName: {
      type: String,
      default: '',
    },
    data: {
      type: String,
      default: '',
    },
  },
  watch: {
    currentValue (newVal, oldVal) {
      this.isChecked = this.getBooleanValue(newVal)
    },
  },
  data () {
    return {
      uuid: this.$uuid.v1(),
      isChecked: this.getBooleanValue(this.currentValue),
    }
  },
  created () {
    this.isChecked = this.getBooleanValue(this.currentValue)
    this.$emitter.on('dashboard-change-theme', () => {
      this.uuid = this.$uuid.v1()
    })
  },
  methods: {
    onChange () {
      if (this.disabled === true)
        return

      this.isChecked = !this.isChecked
      this.onChangeValue(this.propName, this.isChecked, this.item, this.data)
    },
    getBooleanValue (value) {
      if (value === undefined)
        return false

      if (value.toString() === 'true')
        return true

      return false
    },
    getStyles (text) {
      if (text === '' || text === undefined || text === null)
        text = '.'
      text = `${ text }${ text.length }`
      let style = this.$getHexColor(text, false, 20, 50, 100)
      if (this.$config.is_light_theme)
        style = this.$getHexColor(text, false, 40, 80, 100)
      return style
    },
    hasImageId () {
      let hasImage = false
      if (this.imgPropName === '')
        return hasImage

      if (this.item !== null && this.item.get(this.imgPropName) > 0)
        hasImage = true
      return hasImage
    },
  },
}
</script>

<style scoped lang="css">
#input-wrapper {
  -webkit-user-select: none;
  cursor: pointer;
  display: flex;
  margin: auto;
  max-width: 480px;
  position: relative;
  user-select: none;
}

#input-wrapper.align-left {
  align-self: start;
  margin: 4px 0;
}

#input-wrapper.align-center {
  align-self: center;
}

#input-wrapper label {
  align-self: center;
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  margin-left: 8px;
  pointer-events: none;
  position: relative;
  text-transform: uppercase;
}

#input-wrapper.embeded {
  margin: 0;
}

#input-wrapper.embeded label {
  font-size: var(--main-secundary-font-size);
}

#input-wrapper:active label {
  color: var(--main-text-color);
}

#input-wrapper label:first-letter {
  text-transform: uppercase;
}

#input-wrapper input {
  bottom: 0;
  cursor: pointer;
  height: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 0;
}

#checkmark {
  align-self: center;
  border-radius: 3px;
  border: var(--main-checkbox-border);
  flex-shrink: 0;
  height: 12px;
  position: relative;
  width: 12px;
}

#input-wrapper input.checked ~ #checkmark {
  background-color: var(--main-accent-color);
  border: var(--main-checkbox-border-hover);
}

#checkmark:after {
  content: "";
  display: none;
  position: absolute;
}

#input-wrapper #checkmark:after {
  border-color: var(--main-box-bg-color);
  border-radius: 3px;
  border-style: solid;
  border-width: 2px;
  bottom: 0;
  left: 0;
  margin: auto;
  right: 0;
  top: 0;
}

#input-wrapper input.checked ~ #checkmark {
  background-color: var(--main-box-bg-color-op);
}

#input-wrapper input.checked ~ #checkmark .svg {
  fill: var(--main-accent-color);
  display: flex;
}

#letter-checkbox {
  align-items: center;
  display: flex;
  height: 32px;
  justify-content: center;
  width: 32px;
}

#letter {
  align-items: center;
  background-color: var(--main-accent-color);
  border-radius: 6px;
  display: flex;
  font-size: 18px;
  font-weight: 300;
  height: 24px;
  justify-content: center;
  line-height: 1;
  margin: auto;
  position: absolute;
  text-align: center;
  text-transform: uppercase;
  width: 24px;
  z-index: 1;
}

.avatar {
  border-radius: 6px;
  display: flex;
  height: 24px;
  justify-content: center;
  margin: auto 0 auto 0;
  overflow: hidden;
  position: absolute;
  width: 24px;
  z-index: 1;
}

</style>
