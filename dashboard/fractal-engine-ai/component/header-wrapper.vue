<template>
  <div id="header-wrapper">
    <div id="title-wrapper">
      <NavigationButtons/>
      <div
        id="title"
        v-bind:class="{
          dark: isFullContent,
        }">
        <h2>
          {{ $t(`${ headerTitle }`) }}
        </h2>
        <div
          v-if="chipText"
          id="chip">
          {{ chipText }}
        </div>
      </div>
    </div>
    <div id="actions">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {
  useRouter,
  useRoute
} from 'vue-router'

import NavigationButtons from './navigation-buttons.vue'

export default {
  props: [
    'title',
    'chipText',
    ],
  components: {
    NavigationButtons,
  },
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      headerTitle: '',
      isFullContent: false,
    }
  },
  created () {
    if (this.sectionTitle === undefined || this.sectionTitle === '') {
      this.route.name
      return
    }
    this.headerTitle = this.title
  },
}
</script>

<style scoped lang="css">

#title-wrapper {
  display: flex;
}

#title {
  display: flex;
  flex-grow: 0;
}

#title > div {
  display: flex;
  position: relative;
}

h2 {
  align-self: center;
  color: var(--main-text-color);
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  letter-spacing: normal;
  margin: 0 4px;
  padding: 0;
  text-transform: uppercase;
  white-space: nowrap;
}

.dark h2 {
  color: var(--main-accent-color);
}

#header-wrapper {
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  margin: 0 16px 3px 16px;
  position: relative;
  z-index: 1;
}

#actions {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

#actions div {
  margin-left: 4px;
}

#actions div:first-child {
  margin-left: 0;
}


#chip {
  align-self: center;
  background-color: var(--chip-success-bkg);
  border-radius: 10px;
  color: var(--chip-success-color);
  display: flex;
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  height: 16px;
  margin: 0 4px 0 0;
  padding: 4px 12px;
  text-align: center;
  text-transform: uppercase;
  transition-duration: 100ms;
}

.dark #chip {
  color: var(--chip-success-color);
}

</style>
