<template lang="html">
  <div>
    <div id="navigation-tabs">
      <perfect-scrollbar class="scroll-area shadow">
        <div
          id="tabs"
          v-bind:class="{
            'is-top': isTop,
            'is-embeded-modal': isEmbededModal,
          }">
          <div
            v-for="(slotName, slotIndex) in slots"
            v-bind:class="{
              'tab': true,
              'active': isTabActive(slotIndex),
            }"
            v-on:click="onClickTab(slotIndex)">
            <i
              class="material-symbols-rounded icon">
              {{ getTabIcon(slotName) }}
            </i>
            <span>
              {{ $t(slotName) }}
            </span>
          </div>
        </div>
      </perfect-scrollbar>
      <div id="content-tabs">
        <div
          v-for="(slotName, slotIndex) in slots"
          v-bind:class="{
            'content-tab': true,
            'content-tab-active': isTabActive(slotIndex),
            }">
          <div
            v-bind:class="{
              'expanded': !notExpanded,
            }">
            <slot v-bind:name="slotName"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// NOTE: example
// <NavigationTab>
//   <template slot="localization one">
//     <h1>Slot content one</h1>
//   </template>
//   <template slot="classification two">
//     <h1>Slot content two</h1>
//   </template>
//   <template slot="financial three">
//     <h1>Slot content three</h1>
//   </template>
//   <template slot="address four">
//     <h1>Slot content four</h1>
//   </template>
// </NavigationTab>

export default {
  components: {

  },
  props: [
    'isEmbededModal',
    'isTop',
    'initialTabIndex',
    'tabIcons',
    'notExpanded',
    'setTab',
  ],
  data () {
    return {
      slots: [],
      index: 0,
    }
  },
  created () {
    this.slots = Object.keys(this.$slots)
    if (this.initialTabIndex !== undefined && this.initialTabIndex > -1)
      this.onClickTab(this.initialTabIndex)
  },
  watch: {
    initialTabIndex (newVal, oldVal) {
      if (newVal !== undefined && newVal >= 0)
        this.onClickTab(newVal)
    },
    setTab (newVal, oldVal) {
      this.onClickTab(newVal)
    },
  },
  methods: {
    onClickTab (tabIndex) {
      this.index = tabIndex
    },
    isTabActive (tabIndex) {
      if (this.index === tabIndex)
        return true

      return false
    },
    getTabIcon (slotName) {
      if (this.tabIcons === undefined)
        return

      let iconName = ''
      for (var tabData of this.tabIcons)
        if (tabData.slot_name === slotName) {
          iconName = tabData.slot_icon
          break
        }
      return iconName
    },
  },
}
</script>

<style scoped lang="css">
#navigation-tabs {
  position: relative;
  margin: 12px 0 0 0;
}

.scroll-area {
  height: 40px;
}

#tabs {
  background-color: transparent;
  border-bottom: solid 1px var(--main-division-color);
  display: inline-flex;
  margin: 0;
  transition-duration: 100ms;
  width: 100%;
}

#tabs.is-top {
  margin: 0;
}

#tabs.is-embeded-modal {
  width: calc(100% - 12px);
  margin: 0 6px;
}

.tab {
  -webkit-user-select: none;
  border-radius: 10px;
  color: var(--main-text-color);
  cursor: pointer;
  font-weight: 600;
  padding: 4px 8px 6px 8px;
  position: relative;
  text-transform: uppercase;
  user-select: none;
  white-space: nowrap;
}

.tab:hover {
  background-color: var(--main-hover-color);
}

.tab:active {
  color: var(--main-text-color);
  background-color: var(--main-active-color);
}

.active {
  color: var(--main-text-color);
  position: relative;
}

.active:after {
  background-color: var(--main-accent-color);
  border-radius: 3px;
  bottom: 0;
  content: "";
  height: 3px;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  width: calc(100% - 20%);
}

#content-tabs {
  position: relative;
}

.content-tab {
  display: none;
  padding: 0;
}

.content-tab-active {
  display: block;
}

.tab span {
  font-size: var(--main-accent-font-size);
}

.icon {
  font-size: 18px;
  margin-right: 5px;
  position: relative;
  top: 4px;
}

.expanded {
  margin-bottom: 270px;
}

</style>
