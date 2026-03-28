<template lang="html">
  <div
    id="button-wrapper"
    v-on:click="onClick"
    v-bind:class="{
      active: isActive,
      }">
    <i
      v-if="buttonIcon"
      id="icon"
      class="material-symbols-rounded"
      v-bind:style="customIconStyle">
      {{ buttonIcon }}
    </i>
  </div>
</template>

<script>
export default {
  props: [
    'buttonIcon',
    'buttonAction',
    'buttonData',
    'customIconStyle',
    'isActive',
  ],
  methods: {
    onClick () {
      this.buttonAction(this.buttonData)
    },
  },
}
</script>

<style scoped lang="css">
#button-wrapper {
  background: transparent;
  border-radius: 6px;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-weight: 600;
  height: 24px;
  justify-content: center;
  justify-items: center;
  outline: none;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  width: 24px;
}

#button-wrapper:hover {
  background-color: var(--main-hover-color);
}

#button-wrapper:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

#button-wrapper.active {
  background-color: var(--main-hover-color);
  color: var(--main-text-color);
}

#icon {
  align-self: center;
  line-height: 1;
  padding: 1px;
}

</style>
