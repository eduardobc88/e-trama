<template lang="html">
  <div class="splash-screen-wrapper">
    <div class="content-wrapper">
      <img
        id="logo"
        src="/static/dashboard/fractal-engine-ai/assets/fractal-engine-ai-logo.png"
        v-bind:class="{
          'animation': logoLoaded,
        }"/>
      <img
        id="icon"
        src="/static/dashboard/fractal-engine-ai/assets/fractal-engine-ai-icon.png"
        v-bind:class="{
          'animation': logoLoaded,
        }"/>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      profile: new this.$model.ProfileMC.model(),
      session: new this.$model.SessionMC.model(),
      logoLoaded: false,
    }
  },
  created () {
    setTimeout(this.getData, 100)
  },
  methods: {
    async getData () {
      this.$config.user_data = this.profile
      this.$config.session = this.session
      this.$config.user_data.set('user_id', this.$getCookie('user_id'))
      try {
        this.logoLoaded = true
        await this.$config.user_data.fetch()
        this.$config.session.set('id', this.$config.user_data.get('id'))
        this.$i18n.locale = this.$config.user_data.get('language_id_ref')
        this.$emitter.emit('app-user-profile-loaded', { initial: true })
        this.$emitter.emit('app-user-language', this.$config.user_data.get('language_id'))
      } catch (err) {
        this.$emitter.emit('dashboard-show-login', {})
        console.error(err)
      }
    },
  }
}
</script>

<style scoped lang="css">

.splash-screen-wrapper {
  background-color: var(--main-theme-color);
  display: flex;
  height: 100%;
  position: fixed;
  width: 100%;
  z-index: 99;
}

.content-wrapper {
  align-self: center;
  margin: auto;
}


#logo {
  align-self: center;
  display: flex;
  filter: drop-shadow(0px 0px 16px rgba(255, 255, 255, 0.5));
  height: 7vh;
  left: 0;
  margin: auto;
  opacity: 0;
  position: absolute;
  right: 0;
  z-index: 1;
}

#logo.animation {
  transition-duration: 0.7s;
  opacity: 1;
  transition-delay: 1s;
}

#icon {
  align-self: center;
  display: flex;
  filter: drop-shadow(0px 0px 16px rgba(255, 255, 255, 0.5));
  height: 150vh;
  left: 0;
  margin: auto;
  opacity: 0;
  position: absolute;
  right: 0;
  transform: rotate(45deg);
}

#icon.animation {
  animation-duration: 1.2s;
  animation-name: animation;
}





@keyframes animation {
  0% {
    height: 150vh;
    transition: all ease-in;
    transform: rotate(180deg);
  }
  2% {
    height: 150vh;
    transition: all ease-in;
  }
  20% {
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
  100% {
    height: 7vh;
    transition: all ease-out;
    transform: rotate(-45deg);
  }
}

</style>
