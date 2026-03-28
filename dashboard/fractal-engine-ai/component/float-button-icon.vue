<template lang="html">
  <transition name="dropup-transition" mode="out-in">
    <div
      v-if="isRender"
      id="wrapper"
      class="transition-wrapper">
      <div
        id="button-wrapper"
        v-on:click="buttonAction">
        <div id="button">
          <div>
            {{ $t(buttonText) }}
          </div>
          <i
            v-if="buttonIcon"
            class="material-symbols-rounded icon">
            {{ buttonIcon }}
          </i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: [
    'buttonText',
    'buttonIcon',
    'buttonAction',
  ],
  data () {
    return {
      isRender: false,
      timeToRender: 1000,
    }
  },
  mounted () {
    setTimeout(() => {
      this.isRender = true
    }, this.timeToRender)
  },
}
</script>

<style scoped lang="css">

#wrapper {
  position: fixed;
  right: 0;
  bottom: 0;
}

#button-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background-color: var(--main-box-bg-color);
  border-radius: 60px;
  border: var(--main-border);
  bottom: 77px;
  box-shadow: var(--main-box-shadow);
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  margin-left: auto;
  outline: none;
  overflow: hidden;
  position: fixed;
  right: 22px;
  transition-duration: 100ms;
  user-select: none;
}

#button {
  align-self: center;
  display: flex;
  font-size: 20px;
  justify-self: center;
  padding: 6px 10px;
  position: relative;
  text-transform: uppercase;
}

#button-wrapper:hover #button {
  background-color: var(--main-hover-color);
}

#button-wrapper:active #button {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

#button-wrapper .icon {
  font-size: 18px;
  position: relative;
}

#button > div:first-child {
  align-self: center;
  font-size: var(--main-accent-font-size);
  padding: 0 10px;
  text-align: right;
  width: 100%;
  z-index: 1;
}

</style>
