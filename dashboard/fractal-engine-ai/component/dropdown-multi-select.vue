<template>
  <div
    id="wrapper"
    v-click-outside="clickOutsite">
    <div
      id="button"
      v-on:click="showOptions"
      v-bind:class="{
        open: show,
      }">
      <i class="material-symbols-rounded icon">
        {{ getIconName() }}
      </i>
      <label>
        {{ $t(label) }}
      </label>
    </div>
    <transition name="dropdown-transition" mode="out-in">
      <div
        v-if="show"
        id="select-options"
        v-bind:class="{
          'top': openInTop,
          'bottom': !openInTop,
          'full': isFullContent && isLast,
          'transition-wrapper': true,
        }">
        <perfect-scrollbar class="scroll-area">
          <div id="items">
            <Checkbox
              v-for="option in selectOptions"
              :key="option.item_prop"
              class="item"
              v-bind:label="option.item_name"
              v-bind:onChangeValue="onSelect"
              v-bind:currentValue="option.item_value"
              v-bind:item="option"
              v-bind:isAlignLeft="true"
              v-bind:isEmbeded="true"/>
          </div>
        </perfect-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
// // NOTE: example
// selectOptions: [
//   {
//     item_name: 'Name',
//     item_prop: 'classification_name',
//     item_value: false,
//   },
//   {
//     item_name: 'Active',
//     item_prop: 'classification_is_active',
//     item_value: false,
//   },
// ],

import Checkbox from './checkbox.vue'


export default {
  components: {
    Checkbox,
  },
  props: {
    onSelectOption: {
      type: Function,
      default: () => {},
    },
    label: {
      type: String,
      default: '',
    },
    selectOptions: {
      type: Array,
      default: [],
    },
    openInTop: {
      type: Boolean,
      default: false,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      show: false,
      isFullContent: false,
    }
  },
  created () {
    // this.isFullContent = this.$config.dashboard_full_content
    // this.$emitter.on('app-is-full-content', isFullContent => {
    //   this.isFullContent = isFullContent
    // })
  },
  methods: {
    showOptions () {
      this.show = !this.show
    },
    onSelect (propName, isChecked, data) {
      this.onSelectOption(data.item_prop)
    },
    clickOutsite (el) {
      this.show = false
    },
    getIconName () {
      let iconName = this.show ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
      if (this.openInTop)
        return this.show ? 'keyboard_arrow_down' : 'keyboard_arrow_up'

      return iconName
    },
  },
}
</script>

<style scoped lang="css">

#wrapper {
  align-self: center;
  display: flex;
  font-size: var(--main-accent-font-size);
  position: relative;
}

#button {
  align-self: center;
  background: transparent;
  border-radius: 10px;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  max-width: 120px;
  outline: none;
  padding: 8px 10px;
  position: relative;
  text-transform: uppercase;
  user-select: none;
  -webkit-user-select: none;
}

#button label {
  align-self: center;
  cursor: pointer;
  margin: 0 4px;
}

#button:hover {
  background-color: var(--main-hover-color);
}

#button.open,
#button.active,
#button.open label,
#button.open .icon,
#button:active label,
#button:active .icon {
  color: var(--main-text-color) !important;
}

#button.open {
  background-color: var(--main-active-color) !important;
  color: var(--main-text-color) !important;
}

#button.open .icon,
#button.open label,
#button:active > .icon,
#button:active > #title {
  color: var(--main-text-color);
}

#button.open .icon,
#button.open label {
  z-index: 3;
}

#button i {
  align-self: center;
}

#select-options {
  background-color: var(--main-box-bg-color-op);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  left: -50%;
  list-style: none;
  margin: 0;
  overflow: hidden;
  position: absolute;
  right: -50%;
  transition-duration: 100ms;
  width: 200px;
  z-index: 2;
}

#select-options .scroll-area {
  max-height: 350px;
}

#items {
  padding: 10px;
}

#select-options.top {
  bottom: 100%;
}

#select-options.bottom {
  top: calc(100% + 10px);
}

#select-options .item {
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  z-index: 1;
}

#select-options .item:hover {
  background-color: var(--main-hover-color);
}

#select-options .item:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

#select-options.full {
  left: -60px;
}




#button.dark .icon,
#button.dark label,
#button.dark .icon,
#button.dark #title {
  color: var(--main-header-text-color) !important;
}

#button.dark.open,
#button.dark:hover {
  background-color: var(--main-header-search-bkg) !important;
}

</style>
