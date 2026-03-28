<template>
  <transition name="dropup-transition" mode="out-in">
    <div
      v-if="isRender"
      id="wrapper"
      class="transition-wrapper">
      <div
        id="button-wrapper">
        <div
          id="button"
          v-on:click="toggle">
          <i
            class="material-symbols-rounded icon">
            {{ buttonIcon }}
          </i>
        </div>
        <transition name="dropup-transition" mode="out-in">
          <div
            v-if="isExpanded"
            id="options"
            class="transition-wrapper">
            <template v-for="option of options">
              <div
                class="option"
                v-if="option.hidden && option.show"
                v-on:click="option.action">
                <div>
                  {{ option.name }}
                </div>
                <i
                  class="material-symbols-rounded icon">
                  {{ option.icon }}
                </i>
              </div>
              <div
                v-bind:class="`option ${ option.type }`"
                v-if="!option.hidden && option.show"
                v-on:click="option.action">
                <div>
                  {{ option.name }}
                </div>
                <i
                  class="material-symbols-rounded icon">
                  {{ option.icon }}
                </i>
              </div>
            </template>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    openIcon: { default: '' },
    closeIcon: { default: '' },
    options: { default: [] },
    expanded: { default: false },
  },
  data () {
    return {
      isRender: false,
      timeToRender: 1000,
      isExpanded: false,
      buttonIcon: this.openIcon,
    }
  },
  created () {
    if (this.expanded !== undefined && this.expanded){
      this.isExpanded = this.expanded
      this.buttonIcon = this.closeIcon
    }
  },
  mounted () {
    setTimeout(() => {
      this.isRender = true
    }, this.timeToRender)
  },
  methods: {
    toggle () {
      this.isExpanded = !this.isExpanded
      if (this.isExpanded) {
        this.buttonIcon = this.closeIcon
        return
      }
      this.buttonIcon = this.openIcon
    },
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
  border-radius: 100%;
  border: none;
  bottom: 24px;
  box-shadow: var(--main-box-shadow);
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  height: 40px;
  margin-left: auto;
  outline: none;
  position: fixed;
  right: 22px;
  transition-duration: 100ms;
  user-select: none;
  width: 40px;
  z-index: 3;
}

#button {
  border-radius: 100%;
  border: var(--main-border);
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: relative;
  top: 0;
  width: 100%;
}

#button-wrapper:hover #button {
  background-color: var(--main-hover-color);
}

#button-wrapper:active #button {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

#button-wrapper #button .icon {
  bottom: 0;
  font-size: 22px;
  height: var(--main-accent-font-size);
  left: -9px;
  margin: auto;
  position: absolute;
  right: 0;
  top: -9px;
  width: var(--main-accent-font-size);
}

#static-options,
#options {
  bottom: 50px;
  position: absolute;
  right: 0;
}

.option {
  -webkit-user-select: none;
  background-color: var(--main-box-bg-color);
  border-radius: 60px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  margin: 10px 0;
  outline: none;
  overflow: hidden;
  padding: 6px 10px;
  position: relative;
  transition-duration: 100ms;
  user-select: none;
}

.option:before {
  background-color: var(--box-bg-opace-color);
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.option > .icon {
  align-self: center;
  font-size: 20px;
  justify-self: center;
  position: relative;
}

.option > div:first-child {
  align-self: center;
  padding: 0 6px;
  text-align: right;
  text-transform: uppercase;
  width: 100%;
  z-index: 1;
}

.option:hover:before {
  background-color: var(--main-hover-color);
}

.option:active:before {
  background-color: var(--main-active-color);
}

.option:active {
  color: var(--main-text-color);
}

</style>
