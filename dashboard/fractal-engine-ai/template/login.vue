<template lang="html">
  <div id="login-box-wrapper">
    <div
      id="box-content"
      v-bind:class="{
        error: loginError,
        success: loginSuccess,
      }">
      <img
        id="app-logo"
        src="/static/dashboard/fractal-engine-ai/assets/logo.png"/>
      <div id="wrapper">
        <div>
          <img
            v-if="!loginSuccess"
            id="dash"
            src="/static/dashboard/fractal-engine-ai/assets/login-dashboard-img.png"/>
          <p
            v-if="!loginSuccess"
            id="wll">
            {{ $t('wellcome') }}
          </p>
        </div>
        <div>
          <div id="title">
            {{ $t(loginTitle) }}
          </div>
          <p id="error">
            {{ $t(loginErrorMessage) }}
          </p>
          <div id="form-wrapper">
            <div
              v-if="loginSuccess"
              id="userRef">
              {{ this.$config.user_data.get('user_name') }}
            </div>
            <template v-if="!loginSuccess">
              <InputText
                class="input"
                inputName="username"
                v-bind:inputValue="loginUserName"
                v-bind:onChangeValue="onChangeInputUserName"
                propName=""
                v-bind:errorMessage="loginUserNameError"
                helperMessage="your username"
                v-bind:onKeyupEnter="acceptAction"/>
              <InputText
                class="input"
                inputName="password"
                v-bind:inputValue="loginUserPassword"
                v-bind:onChangeValue="onChangeInputUserPassword"
                propName=""
                inputType="password"
                v-bind:errorMessage="loginUserPasswordError"
                helperMessage="your password"
                v-bind:onKeyupEnter="acceptAction"/>
              <Button
                buttonIcon="input"
                v-bind:buttonAction="acceptAction">
                {{ $t('login') }}
              </Button>
            </template>
          </div>
          <div
            v-if="!loginSuccess"
            id="footer">
            <a href="/recover-account">
              recover account
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../component/button.vue'
import InputText from '../component/input-text.vue'

export default {
  data() {
    return {
      profile: new this.$model.ProfileMC.model(),
      session: new this.$model.SessionMC.model(),
      formData: new URLSearchParams(),
      loginUserName: '',
      loginUserPassword: '',
      loginErrorMessage: '',
      loginUserNameError: '',
      loginUserPasswordError: '',
      loginError: false,
      loginSuccess: false,
      loginTitle: 'login',
    }
  },
  components: {
    Button,
    InputText,
  },
  watch: {
    loginUserName (newValues, oldValues) {
      this.validateUserName()
    },
    loginUserPassword (newValues, oldValues) {
      this.validateUserPassword()
    },
  },
  methods: {
    async acceptAction () {
      try {
        this.loginTitle = 'login'
        this.loginErrorMessage = ''
        this.loginSuccess = false
        this.loginError = false
        if (!this.validateUserName() || !this.validateUserPassword())
          throw 'fill the required fields'

        this.formData.delete('user_name')
        this.formData.delete('user_pass')
        this.formData.append('user_name', this.loginUserName)
        this.formData.append('user_pass', this.loginUserPassword)
        let data = await this.$axios.post(this.$config.login_api_url, this.formData, {
            headers: {
              'csrf-token': this.$getCookie('csrf-token'),
            },
          })
        let error_message = data.data.error_message
        if (error_message)
          throw error_message
        this.loginSuccess = true
        this.loginTitle = 'login success'
        this.loadUserProfile()
      } catch (err) {
        this.loginError = true
        this.loginErrorMessage = err.response.data.status_msg
      }
    },
    async loadUserProfile () {
      this.$config.user_data = this.profile
      this.$config.session = this.session
      this.$config.user_data.set('user_id', this.$getCookie('user_id'))
      try {
        await this.$config.user_data.fetch()
        this.$config.session.set('id', this.$config.user_data.get('id'))
        this.$i18n.locale = this.$config.user_data.get('language_id_ref')
        this.$emitter.emit('app-user-profile-loaded', { initial: true })
        this.$emitter.emit('app-user-language', this.$config.user_data.get('language_id'))
      } catch (err) {
        this.loginErrorMessage = 'error loading user data'
        console.error(err)
      }
    },
    onChangeInputUserName (propName, value) {
      this.loginUserName = value
    },
    onChangeInputUserPassword (propName, value) {
      this.loginUserPassword = value
    },
    validateUserName () {
      if (!this.loginUserName) {
        this.loginUserNameError = 'required'
        return false
      }
      this.loginUserNameError = ''
      return true
    },
    validateUserPassword () {
      if (!this.loginUserPassword) {
        this.loginUserPasswordError = 'required'
        return false
      }
      this.loginUserPasswordError = ''
      return true
    },
  },
}
</script>

<style scoped lang="css">
#app-logo {
  display: flex;
  filter: drop-shadow(0px 0px 16px rgba(255, 255, 255, 0.5));
  left: calc(33% - 92px);
  margin: auto;
  padding: 10px 0 0 0;
  position: absolute;
  z-index: 3;
}

#login-box-wrapper {
  background: var(--main-body-bg-color);
  bottom: 0;
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 5;
}

#box-content {
  align-self: center;
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  margin: auto;
  max-width: 700px;
  overflow: hidden;
  position: relative;
  width: calc(100% - 50px);
}

#box-content.error {
  border: 1px solid var(--main-color-error);
  transition-duration: 100ms;
}

#box-content.success {
  border: 1px solid var(--main-color-success);
}

#title {
  color: var(--main-text-color);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 32px;
  margin: 50px 0 20px 0;
  text-align: center;
  text-transform: uppercase;
}

#userRef {
  color: var(--main-text-color);
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 32px;
  margin: 0 0 50px 0;
  text-align: center;
  text-transform: uppercase;
}

#error {
  color: var(--main-color-error);
  font-size: var(--main-font-size);
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
}

#form-wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: 180px;
}

#form-wrapper > #button-wrapper {
  margin: 10px 0;
}

#wrapper {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 2fr;
  padding: 10px;
  position: relative;
  z-index: 2;
}

#wrapper > div:first-child {
  display: flex;
}

#wrapper > div:first-child:after {
  background-color: var(--main-gradient-bkg-color);
  bottom: 0;
  content: "";
  height: calc(100% + 40px);
  left: -20px;
  position: absolute;
  right: 0;
  top: -20px;
  width: calc(33% + 30px);
  z-index: -1;
}

#wrapper > div:last-child {

}

#dash {
  align-self: center;
  margin: auto;
  max-width: 150px;
  width: 100%;
}

#wll {
  bottom: 10px;
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 500;
  left: 10px;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 0;
  text-transform: uppercase;
  width: 25%;
}

#footer {
  display: flex;
  justify-content: end;
}

#footer > a {
  color: var(--main-secondary-text-color);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
  text-decoration: none;
}

#footer > a:hover {
  color: var(--main-text-color);
}

</style>
