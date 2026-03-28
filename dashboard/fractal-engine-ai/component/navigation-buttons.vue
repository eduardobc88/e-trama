<template lang="html">
  <div id="navigation-buttons-wrapper">
    <div
      class="button-wrapper"
      v-on:click="routerHistory(historyBack)"
      v-bind:style="this.getColor()">
      <i class="material-symbols-rounded icon">
        keyboard_arrow_left
      </i>
    </div>
    <div
      class="button-wrapper"
      v-on:click="routerHistory(historyNext)"
      v-bind:style="this.getColor()">
      <i class="material-symbols-rounded icon">
        keyboard_arrow_right
      </i>
    </div>
  </div>
</template>

<script>
import {
  useRouter,
  useRoute
} from 'vue-router'

export default {
  props: [
    'buttonColor',
  ],
  data() {
    return {
      router: useRouter(),
      route: useRoute(),
      historyBack: -1,
      historyNext: 1,
    }
  },
  components: {},
  created() {},
  methods: {
    routerHistory (position) {
      this.router.go(position)
    },
    getColor () {
      if (this.buttonColor)
        return `color: ${ this.buttonColor }`

      return 'color: var(--main-text-color)'
    },
  },
}
</script>

<style scoped lang="css">

#navigation-buttons-wrapper {
  -webkit-user-select: none;
  display: flex;
  position: relative;
  user-select: none;
}

.button-wrapper {
  background: transparent;
  border-radius: 8px;
  color: var(--main-text-color);
  cursor: pointer;
  display: inline-flex;
  font-weight: 600;
  height: 24px;
  justify-content: center;
  margin-right: 5px;
  outline: none;
  position: relative;
  width: 24px;
}

.button-wrapper:hover {
  background-color: var(--main-hover-color);
}

.button-wrapper:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

.button-wrapper:active .icon {
  color: var(--main-text-color);
}

.button-wrapper .icon {
  align-self: center;
  line-height: 1;
}
</style>
