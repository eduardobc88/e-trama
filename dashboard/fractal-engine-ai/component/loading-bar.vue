<template>
  <transition name="bounce">
    <div
      v-if="isLoading"
      id="progress"
      v-bind:class="{
        full: isFull,
      }">
      <div class="preloader">
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    isFull: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {

    }
  },
  methods: {

  },
}
</script>

<style scoped lang="css">

#progress {
  display: block;
  height: 4px;
  left: 0;
  margin: auto;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  right: 0;
  width: 100%;
  z-index: 1;
  top: 0;
}

#progress.full {
  width: 100%;
}

.preloader {
  height: 4px;
  width: 100%;
}

.preloader:before {
  -moz-animation: color_animation_a 1.5s linear infinite;
  -webkit-animation: color_animation_a 1.5s linear infinite;
  animation: color_animation_a 1.5s linear infinite;
  background: var(--main-accent-color);
  content: '';
  display: block;
  height: 4px;
  left: 0;
  margin: auto;
  position: absolute;
  top: 0;
  transform: translateX(-100%);
  width: 50%;
  z-index: 1;
}

@keyframes color_animation_a {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}
</style>
