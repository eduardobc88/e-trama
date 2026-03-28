<template lang="html">
  <div
    v-bind:class="{ 'select-wrapper': true, open: show }"
    v-on:click="showOptions"
    v-click-outside="clickOutsite">
    <i class="material-symbols-rounded">
      {{ getIconName() }}
    </i>
    <label>
      {{ $t(label) }}
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
            id="items">
            <div
              class="item"
              v-for="option in selectOptions"
              v-on:click="onSelect(option.value)">
              {{ $t(option.name) }}
            </div>
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
    'label',
    'selectOptions',
    'openInTop',
  ],
  data () {
    return {
      currentValue: '',
      show: false,
    }
  },
  methods: {
    showOptions () {
      this.show = !this.show
    },
    onSelect (value) {
      this.currentValue = value
      this.onSelectOption(this.currentValue)
    },
    clickOutsite (event) {
      this.show = false
    },
    getIconName () {
      let iconName = this.show ? 'expand_less' : 'expand_more'
      if (this.openInTop)
        return this.show ? 'expand_more' : 'expand_less'

      return iconName
    },
  },
}
</script>

<style scoped lang="css">
.select-wrapper {
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

.select-wrapper > i {
  align-self: center;
}

.select-wrapper label {
  align-self: center;
  cursor: pointer;
  margin: 0 4px;
}

.select-wrapper:hover {
  background-color: var(--main-hover-color);
}

.select-wrapper.open,
.select-wrapper:active {
  background-color: var(--main-active-color);
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

.top {
  bottom: 0;
  padding: 0 0 26px 0;
}

.bottom {
  padding: 0;
  top: 0;
}

#select-options.top {
  padding-bottom: 24px;
}

#select-options.bottom {
  top: calc(100% + 10px);
}

#select-options .item {
  border-radius: 8px;
  color: var(--main-text-color);
  overflow: hidden;
  padding: 9px;
  text-overflow: ellipsis;
  z-index: 1;
  position: relative;
}

#select-options .item:hover {
  background-color: var(--main-hover-color);
}

#select-options .item:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

</style>
