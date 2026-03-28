<template lang="html">
  <div
    v-bind:class="{
      'select-wrapper': true,
      open: show,
    }"
    v-on:click="showOptions"
    v-click-outside="clickOutsite">
    <i class="material-symbols-rounded">
      {{ getIconName() }}
    </i>
    <label>
      {{ `${ $t(label) }: ${ $t(getOptionName()) }` }}
    </label>
    <transition name="dropdown-transition" mode="out-in">
      <div
        id="select-options"
        v-bind:class="{
          'top': openInTop,
          'bottom': !openInTop,
          'transition-wrapper': true,
        }"
        v-if="show">
        <perfect-scrollbar>
          <div
            class="item"
            v-for="(option, index) in selectOptions"
            v-on:click="onSelect(index)">
            {{ $t(option.name) }}
          </div>
        </perfect-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: [
    'onSelectOption',
    'selectOptions',
    'initialIndexOption',
    'label',
    'openInTop',
  ],
  data () {
    return {
      currentIndex: 0,
      show: false,
      currentOptionLabel: '',
    }
  },
  watch: {
    initialIndexOption (newVal, oldVal) {
      this.currentIndex = newVal
    },
  },
  created() {
    this.currentIndex = this.initialIndexOption
  },
  methods: {
    showOptions () {
      this.show = !this.show
    },
    onSelect (index) {
      this.currentIndex = index
      this.onSelectOption(this.selectOptions[index])
    },
    clickOutsite (event) {
      this.show = false
    },
    getOptionName () {
      let option = this.selectOptions[this.currentIndex]
      if (!option) return ''

      return option.name
    },
    getIconName () {
      let iconName = this.show ? 'expand_more' : 'expand_less'
      if (!this.openInTop)
        iconName = this.show ? 'expand_less' : 'expand_more'
      if (this.openInTop)
        return this.show ? 'expand_more' : 'expand_less'

      return iconName
    },
  },
}
</script>

<style scoped lang="css">
.select-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background: transparent;
  border-radius: 10px;
  border: none;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  height: 12px;
  outline: none;
  padding: 10px 15px;
  position: relative;
  text-transform: uppercase;
  user-select: none;
}

.select-wrapper > i {
  align-self: center;
}

.select-wrapper label {
  align-self: center;
  cursor: pointer;
}

.select-wrapper:hover {
  background-color: var(--main-hover-color);
}

.select-wrapper:hover label,
.select-wrapper:hover .icon {
  color: var(--main-text-color) !important;
}

.select-wrapper.open .icon,
.select-wrapper.open label {
  z-index: 2;
}

.select-wrapper .icon {
  align-self: center;
  font-size: 20px;
  line-height: 1;
  margin-right: 5px;
  position: relative;
}

#select-options {
  background-color: var(--main-box-bg-color-op);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  left: -50%;
  list-style: none;
  margin: 0;
  max-height: 150px;
  min-width: 112px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  right: -50%;
  z-index: 2;
}

#select-options .scroll-area {
  max-height: 350px;
}

.top {
  bottom: 0;
  padding: 0 0 26px 0;
}

.bottom {
  padding: 26px 0 0 0;
  top: 0;
}

#select-options.top {
  padding-bottom: 24px;
}

#select-options.bottom {
  top: calc(100% + 10px);
}

#select-options .item {
  background-color: var(--main-box-bg-color-op);
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  padding: 10px 15px;
  position: relative;
  text-transform: uppercase;
  z-index: 1;
}

#select-options .item:hover {
  background-color: var(--main-hover-color);
  color: var(--main-accent-color) !important;
}

.select-wrapper.open {
  background-color: var(--main-box-bg-color-op);
}
</style>
