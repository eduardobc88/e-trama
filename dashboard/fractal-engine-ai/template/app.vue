<template lang="html">
  <div
    id="app-wrapper"
    v-window-resize="onResizeWindow"
    :style="appTheme">
    <DashboardHeader
      v-if="userProfileLoaded"
      v-bind:isFullContent="isFullContent"/>
    <transition name="openleft-transition" mode="out-in">
      <SidebarMenu
        class="left-menu-wrapper transition-wrapper"
        v-if="isSidebarMenuOpen && userProfileLoaded"
        v-bind:isSticky="isSidebarMenuSticky"/>
    </transition>
    <div
      v-if="userProfileLoaded"
      id="content">
      <NavigationHeader
        v-bind:width="navigationHeaderViewWidth"/>
      <perfect-scrollbar
        class="ps-router-view"
        v-bind:style="{
          width: `${ routerViewWidth }px`,
          height: `${ routerViewHeight }px`,
          'justify-self': 'center',
          'margin': `${ marginHeader }px 0 0 auto`
        }">
        <div
          id="router-view">
          <router-view v-slot="{ Component }">
            <transition name="route-transition" mode="out-in">
              <component :is="Component" :key="$route.fullPath"/>
            </transition>
          </router-view>
        </div>
      </perfect-scrollbar>
    </div>
    <transition name="openright-transition" mode="out-in">
      <SidebarActivity
        v-if="isSidebarActivityOpen && userProfileLoaded"
        class="right-menu-wrapper transition-wrapper"
        v-bind:class="{
          sticky: false,
        }"
        v-bind:style="{
          'z-index': 5,
        }"
        v-bind:isSticky="false"
        v-bind:collection="notifications"/>
    </transition>
    <transition name="animation-transition">
      <SplashScreen v-if="showSplashScreen && !userProfileLoaded"/>
    </transition>
    <transition name="animation-transition">
      <Login v-if="showLogin && !userProfileLoaded"/>
    </transition>
    <transition name="dropdown-transition" mode="out-in">
      <ConfirmationModal
        class="transition-wrapper"
        v-if="confirmationModalData"
        v-bind:modalTitle="confirmationModalData.modalTitle"
        v-bind:modalDescription="confirmationModalData.modalDescription"
        v-bind:cancelAction="confirmationModalData.cancelAction"
        v-bind:acceptAction="confirmationModalData.acceptAction"/>
    </transition>
    <transition name="dropdown-transition" mode="out-in">
      <InputModal
        v-if="inputModalData"
        v-bind:modalTitle="inputModalData.modalTitle"
        v-bind:modalDescription="inputModalData.modalDescription"
        v-bind:inputName="inputModalData.inputName"
        v-bind:helperMessage="inputModalData.helperMessage"
        v-bind:modalAccept="inputModalData.modalAccept"
        v-bind:modalCancel="inputModalData.modalCancel"/>
    </transition>
    <transition name="dropdown-transition" mode="out-in">
      <PreviewFileModal
        v-if="previewFileModalData"
        v-bind:onClose="previewFileModalData.onClose"
        v-bind:onRemove="previewFileModalData.onRemove"
        v-bind:onSave="previewFileModalData.onSave"
        v-bind:metaFields="previewFileModalData.metaFields"
        v-bind:file="previewFileModalData.file"/>
    </transition>
    <transition name="dropdown-transition" mode="out-in">
      <FileModal
        v-if="fileModalData"
        v-bind:onlyImages="fileModalData.onlyImages"
        v-bind:modalTitle="fileModalData.modalTitle"
        v-bind:modalDescription="fileModalData.modalDescription"
        v-bind:closeFileModal="fileModalData.closeFileModal"
        v-bind:onFileSelect="fileModalData.onFileSelect"/>
    </transition>
    <transition name="dropdown-transition" mode="out-in">
      <CardModal
        v-if="cardModalData"
        v-bind:modalTitle="cardModalData.modalTitle"
        v-bind:modalDescription="cardModalData.modalDescription"
        v-bind:modalAccept="cardModalData.modalAccept"
        v-bind:modalModel="cardModalData.modalModel"
        v-bind:modalId="cardModalData.modalId"/>
    </transition>
    <transition name="dropdown-transition" mode="out-in">
      <CandidateModal
        v-if="candidateModalData"
        v-bind:modalTitle="candidateModalData.modalTitle"
        v-bind:modalDescription="candidateModalData.modalDescription"
        v-bind:modalAccept="candidateModalData.modalAccept"
        v-bind:modalModel="candidateModalData.modalModel"
        v-bind:modalCollection="candidateModalData.modalCollection"
        v-bind:modalId="candidateModalData.modalId"/>
    </transition>
    <div
      id="ribbon-status"
      v-if="statusMessages.length && userProfileLoaded">
      <perfect-scrollbar>
        <template v-for="(item, index) of statusMessages">
          <div
            v-if="item !== undefined">
            <RibbonStatus
              v-if="item.type == 'error'"
              v-bind:onClickCloseAction="removeRibbonById"
              v-bind:data="index.key"
              v-bind:title="item.title"
              v-bind:message="item.message"
              type="error"
              :key="index.key"/>
            <RibbonStatus
              v-if="item.type == 'success'"
              v-bind:onClickCloseAction="removeRibbonById"
              v-bind:data="index.key"
              v-bind:title="item.title"
              v-bind:message="item.message"
              type="success"
              :key="index.key"/>
          </div>
        </template>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import {
  useRoute,
  useRouter,
} from 'vue-router'

import BoxWrapper from '../component/box-wrapper.vue'
import ConfirmationModal from '../component/confirmation-modal.vue'
import DashboardHeader from './index/dashboard-header.vue'
import FileModal from '../component/file-modal.vue'
import InputModal from '../component/input-modal.vue'
import Login from './login.vue'
import NavigationHeader from '../component/navigation-header.vue'
import PreviewFileModal from '../component/preview-file-modal.vue'
import RibbonStatus from '../component/ribbon-status.vue'
import SidebarActivity from './index/sidebar-activity.vue'
import SidebarMenu from './index/sidebar-menu.vue'
import SplashScreen from './splash-screen.vue'
import CardModal from '../component/card-modal.vue'
import CandidateModal from '../component/candidate-modal.vue'

let windowIntervalRemove = null


export default {
  components: {
    BoxWrapper,
    ConfirmationModal,
    DashboardHeader,
    FileModal,
    InputModal,
    Login,
    NavigationHeader,
    PreviewFileModal,
    RibbonStatus,
    SidebarActivity,
    SidebarMenu,
    SplashScreen,
    CardModal,
    CandidateModal,
  },
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      i18n: useI18n(),
      userProfileLoaded: false,
      isSidebarMenuOpen: false,
      isSidebarMenuSticky: false,
      isSidebarActivityOpen: false,
      isFullContent: false,
      showSplashScreen: true,
      showLogin: false,
      throttleToggleFullcontent: _.throttle(this.toggleFullContent, 100, { 'trailing': false }),
      throttleShowSidebarMenu: _.throttle(this.showSidebarMenu, 100, { 'trailing': false }),
      throttleShowsidebarActivity: _.throttle(this.showsidebarActivity, 100, { 'trailing': false }),
      throttleLoadNotifications: _.throttle(this.getNotifications, 3000, { 'trailing': false }),
      notifications: new this.$model.NotificationMC.collection(),
      loadNotifications: new this.$model.NotificationMC.collection(),
      totalNotificationPages: 2,
      language: new this.$model.LanguageMC.model(),
      languages: new this.$model.LanguageMC.collection(),
      windowHeight: 0,
      breakWidth: 1025,
      headerButtonActive: true,
      routerViewWidth: 0,
      routerViewHeight: 0,
      navigationHeaderViewWidth: 0,
      confirmationModalData: null,
      inputModalData: null,
      previewFileModalData: null,
      cardModalData: null,
      candidateModalData: null,
      fileModalData: null,
      statusMessages: [],
      ribbonTimeOut: 5000,
      appTheme: {},
      marginHeader: 150,
      isLightTheme: true,
      appThemeLight: {
        '--main-theme-color': '#f8f8f8',
        '--main-accent-color': '#181818',
        '--main-body-bg-color': '#f8f8f8',
        '--main-box-bg-color': '#fdfdfd',
        '--main-box-bg-color-op': '#F2F2F2',
        '--main-text-color': '#424242',
        '--main-secondary-text-color': '#828282',
        '--main-input-border-bottom': '1px solid #424242',
        '--main-input-border-bottom-active': '1px solid #181818',
        '--main-border-color': '#8b8b8b',
        '--main-active-color': '#18181840',
        '--main-hover-color': '#87878720',
        '--main-table-bg-row': '#87878715',
        '--main-font-size': '14px',
        '--main-secundary-font-size': '12px',
        '--main-accent-font-size': '12px',
        '--main-checkbox-border': '2px solid var(--main-border-color)',
        '--main-checkbox-border-hover': '2px solid var(--main-accent-color)',
        '--main-box-shadow': '0 12px 18px -4px rgba(32, 32, 32, 0.1)',
        '--main-notification-bkg': '#ffffff80',
        '--main-icon-font-size': '20px',
        '--main-box-shadow-line': '0 2px 4px -5px rgba(32, 32, 32, 0.1)',
        '--main-color-error': '#b64b4b',
        '--main-color-success': '#4bb64d',
        '--main-box-shadow-light': '0 2px 6px -1px rgba(32, 32, 32, 0.1), 0 6px 18px -1px rgba(32, 32, 32, 0.1)',
        '--main-success-bkg': '#e1f5eb',
        '--main-error-bkg': '#fcdddd',
        '--main-info-bkg': '#d4e6f9',
        '--main-warning-bkg': '#fdf4de',
        '--main-error-bkg-op': '#fcdddd20',
        '--main-border': '1px solid #dfdfdf',
        '--main-gradient-bkg-color': '',
        '--main-menu-bkg': '#fdfdfd',
      },
      appThemeDark: {
        '--main-theme-color': '#343434',
        '--main-accent-color': '#F2F2F2',
        '--main-body-bg-color': '#343434',
        '--main-box-bg-color': '#282828',
        '--main-box-bg-color-op': '#282828',
        '--main-text-color': '#c8c8c8',
        '--main-secondary-text-color': '#8b8b8b',
        '--main-input-border-bottom': '1px solid #505050',
        '--main-input-border-bottom-active': '1px solid #FFFFFF',
        '--main-border-color': '#3b3c3e',
        '--main-active-color': '#FFFFFF60',
        '--main-hover-color': '#87878760',
        '--main-table-bg-row': '#87878715',
        '--main-font-size': '14px',
        '--main-secundary-font-size': '12px',
        '--main-accent-font-size': '12px',
        '--main-checkbox-border': '2px solid var(--main-border-color)',
        '--main-checkbox-border-hover': '2px solid var(--main-accent-color)',
        '--main-box-shadow': '0 12px 18px -4px rgba(32, 32, 32, 0.4)',
        '--main-notification-bkg': '#4d4d4d40',
        '--main-icon-font-size': '20px',
        '--main-box-shadow-line': '0 2px 4px -5px rgba(32, 32, 32, 0.4)',
        '--main-color-error': '#b64b4b',
        '--main-color-success': '#4bb64d',
        '--main-box-shadow-light': '0 2px 6px -1px rgb(22 22 22 / 10%), 0 6px 18px -1px rgb(22 22 22 / 10%)',
        '--main-success-bkg': '#495a48',
        '--main-error-bkg': '#504444',
        '--main-info-bkg': '#414c57',
        '--main-warning-bkg': '#48453d',
        '--main-error-bkg-op': '#50444420',
        '--main-border': '1px solid #3a3a3a',
        '--main-gradient-bkg-color': '',
        '--main-menu-bkg': '#282828',
      },
      notificationRequestTypes: {
        'post': 'created',
        'put': 'updated',
        'delete': 'deleted',
      },
    }
  },
  watch: {
    isFullContent (newValue, oldValue) {
      this.$config.dashboard_full_content = newValue
    },
    isLightTheme (newValue, oldValue) {
      this.setMaterialYouTheme(this.route.meta.title)
      this.$config.is_light_theme = this.isLightTheme
      this.$emitter.emit('dashboard-change-theme', '')
    },
  },
  created () {
    this.initAxiosListenEvent()
    this.getLanguages()
    this.router.afterEach((to, from) => {
      this.setMaterialYouTheme(to.meta.title)
    })
    this.$emitter.on('app-show-splash-screen', data => {
      this.clearUserProfile()
    })
    this.$emitter.on('app-user-profile-loaded', data => {
      this.$config.session.on('notification', data => {
        let status = this.$config.session.get('status')
        if (status)
          this.clearUserProfile()
      })
      this.getNotifications()
      if (data.initial) {
        setTimeout(this.hideSplashScreen, 3000)
        this.setThemeOS()
        setTimeout(() => {
          this.setMaterialYouTheme(this.route.meta.title)
        }, 4000)
      }
    })
    this.$emitter.on('app-user-profile-updated', data => {
      this.setThemeOS()
      this.setMaterialYouTheme(this.route.meta.title)
    })
    this.$emitter.on('dashboard-show-login', () => {
      this.setThemeOS()
      setTimeout(() => {
        this.hideSplashScreen()
        this.userProfileLoaded = false
      }, 1000)
      this.showLogin = true
    })
    this.$emitter.on('dashboard-hide-login', () => {
      this.showLogin = false
    })
    this.$emitter.on('app-user-language', code => {
      if (code !== undefined)
        this.geti18nLocaleMessages(code)
    })
    this.$emitter.on('app-toggle-full-content', () => {
      this.throttleToggleFullcontent()
    })
    this.$emitter.on('app-show-sidebar-menu', () => {
      this.throttleShowSidebarMenu()
    })
    this.$emitter.on('app-hide-sidebar-menu', () => {
      this.hideSidebarMenu()
    })
    this.$emitter.on('dashboard-notification-load', data => {
      this.throttleLoadNotifications()
    })
    this.$emitter.on('app-show-sidebar-activity', () => {
      this.throttleShowsidebarActivity()
    })
    this.$emitter.on('app-hide-sidebar-activity', () => {
      this.hidesidebarActivity()
    })
    this.$emitter.on('confirmation-modal', ObjectData => {
      this.confirmationModalData = ObjectData
    })
    this.$emitter.on('input-modal', ObjectData => {
      this.inputModalData = ObjectData
    })
    this.$emitter.on('file-modal', ObjectData => {
      this.fileModalData = ObjectData
    })
    this.$emitter.on('card-modal', ObjectData => {
      this.cardModalData = ObjectData
    })
    this.$emitter.on('candidate-modal', ObjectData => {
      this.candidateModalData = ObjectData
    })
    this.$emitter.on('preview-file-modal', ObjectData => {
      this.previewFileModalData = ObjectData
    })
    this.$emitter.on('dashboard-ribbon-notification', data => {
      this.statusMessages.push({
        title: data.title,
        type: data.type,
        message: data.message,
        key: this.$uuid.v1(),
      })
      windowIntervalRemove = window.setInterval(() => {
        this.removeLastRibbonStatusNotification()
      }, this.ribbonTimeOut)
    })
    this.$emitter.on('dashboard-app-error', data => {
      this.statusMessages.push({
        title: data.title,
        type: data.type,
        message: data.message,
        key: this.$uuid.v1(),
      })
      windowIntervalRemove = window.setInterval(() => {
        this.removeLastRibbonStatusNotification()
      }, this.ribbonTimeOut)
    })
    this.onResizeWindow()
  },
  methods: {
    setMaterialYouTheme (title) {
      if (!this.userProfileLoaded)
        return

      if (title === '')
        title = '.'
      title = `${ title }${ title.length }`
      let accent = this.$getHexColor(title, true, 10, 60, 100)
      let active = this.$getHexColor(title, true, 10, 35, 100)
      let box = this.$getHexColor(title, true, 5, 20, 100)
      let bkg = this.$getHexColor(title, true, 5, 25, 100)
      let border = this.$getHexColor(title, true, 5, 40, 100)
      let mainBorder = this.$getHexColor(title, true, 5, 19, 100)
      if (this.isLightTheme) {
        accent = this.$getHexColor(title, true, 35, 50, 100)
        active = this.$getHexColor(title, true, 35, 85, 100)
        box = this.$getHexColor(title, true, 25, 95, 100)
        bkg = this.$getHexColor(title, true, 15, 90, 100)
        border = this.$getHexColor(title, true, 10, 60, 100)
        mainBorder = this.$getHexColor(title, true, 15, 80, 50)
      }
      setTimeout(() => {
        this.appTheme['--main-accent-color'] = accent
        this.appTheme['--main-active-color'] = active
        this.appTheme['--main-theme-color'] = bkg
        this.appTheme['--main-body-bg-color'] = bkg
        this.appTheme['--main-menu-bkg'] = box
        this.appTheme['--main-box-bg-color'] = box
        this.appTheme['--main-box-bg-color-op'] = box
        this.appTheme['--main-border-color'] = border
        this.appTheme['--main-border'] = `1px solid ${ mainBorder }`
        this.appTheme['--main-gradient-bkg-color'] = mainBorder
      }, 150)
    },
    setThemeOS () {
      if (!this.userProfileLoaded) {
        this.isLightTheme = true
        let darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)")
        darkThemeMq.addListener(e => {
          this.isLightTheme = true
          if (e.matches) {
            this.appTheme = this.appThemeDark
            this.isLightTheme = false
          } else
            this.appTheme = this.appThemeLight
        })
        if (darkThemeMq.matches) {
          this.appTheme = this.appThemeDark
          this.isLightTheme = false
        } else
          this.appTheme = this.appThemeLight
        this.enableLoadingAppTheme()
        return
      }
      if (!this.$config.user_data.get)
        return

      let themeSync = this.$config.user_data.get('theme')
      if (!themeSync) {
        this.appTheme = this.appThemeLight
        this.enableLoadingAppTheme()
      }
    },
    enableLoadingAppTheme () {
      let metaThemeColor = document.querySelector('head meta[name="theme-color"]')
      if (!this.userProfileLoaded) {
        metaThemeColor.content = this.appTheme['--main-theme-color']
        return
      }
      metaThemeColor.content = this.appTheme['--main-theme-color']
    },
    initAxiosListenEvent () {
      this.$axios.interceptors.response.use(
        response => {
          let requestMethod = response.config.method
          let requestURL = response.config.url
          let statusCode = response.data.status_code
          let statusMessage = response.data.status_msg
          let ribbonData = {
            type: '',
            title: '',
            message: '',
          }
          let resource = requestURL.split(this.$config.app_api_url)
          if (resource.length > 1) {
            resource = resource[1]
            resource = resource.split('/')
            if (resource.length)
              resource = resource[1]
          }
          if (requestMethod !== 'get') {
            if (statusCode === 0) {
              ribbonData.type = 'success'
              ribbonData.title = resource
              ribbonData.message = `${ resource } ${ this.notificationRequestTypes[requestMethod] }`
              this.$emitter.emit('dashboard-ribbon-notification', ribbonData)
            } else if (statusCode === 1) {
              ribbonData.type = 'error'
              ribbonData.title = resource
              ribbonData.message = statusMessage
              this.$emitter.emit('dashboard-ribbon-notification', ribbonData)
            } else if (statusCode === 3)
              this.showLogin = true
          }
          return response
        },
        error => {
          let ribbonData = {
            type: 'error',
            title: error.response.config.url.split('/')[4],
            message: error.response.data.status_msg,
          }
          this.$emitter.emit('dashboard-app-error', ribbonData)
          return Promise.reject(error)
        },
      )
    },
    clearUserProfile () {
      this.userProfileLoaded = false
      this.showSplashScreen = true
      this.enableLoadingAppTheme()
    },
    hideSplashScreen () {
      this.userProfileLoaded = true
      this.showSplashScreen = false
      this.enableLoadingAppTheme()
    },
    toggleFullContent () {
      if (this.isFullContent) {
        this.isFullContent = false
        this.isSidebarMenuOpen = true
        this.isSidebarActivityOpen = false
        this.isSidebarMenuSticky = true
      } else {
        this.isFullContent = true
        this.isSidebarMenuOpen = false
        this.isSidebarActivityOpen = false
        this.isSidebarMenuSticky = false
      }
      this.$emitter.emit('app-is-full-content', this.isFullContent)
      this.setRouterViewDimensions()
    },
    showSidebarMenu () {
      this.isSidebarMenuOpen = true
      this.isSidebarActivityOpen = false
      this.isSidebarMenuSticky = false
      if (!this.isFullContent) {
        this.isSidebarMenuSticky = true
        if (this.headerButtonActive)
          this.isSidebarActivityOpen = true
      }
    },
    showsidebarActivity () {
      this.headerButtonActive = true
      this.isSidebarActivityOpen = true
      if (!this.isFullContent && this.isSidebarMenuSticky)
        this.isSidebarActivityOpen = true
    },
    hideSidebarMenu () {
      if (this.isFullContent)
        this.isSidebarMenuOpen = false
    },
    hidesidebarActivity () {
      this.isSidebarActivityOpen = false
    },
    onResizeWindow () {
      this.windowHeight = window.innerHeight
      this.isSidebarActivityOpen = false
      if (window.innerWidth >= this.breakWidth) {
        this.isFullContent = false
        this.isSidebarMenuOpen = true
        this.isSidebarMenuSticky = true
      } else {
        this.isFullContent = true
        this.isSidebarMenuOpen = false
        this.isSidebarMenuSticky = false
      }
      this.$emitter.emit('app-is-full-content', this.isFullContent)
      this.$emitter.emit('app-resize-window', null)
      this.setRouterViewDimensions()
    },
    setRouterViewDimensions () {
      this.routerViewHeight = window.innerHeight - this.marginHeader
      this.routerViewWidth =  window.innerWidth
      this.navigationHeaderViewWidth = window.innerWidth
      if (!this.isFullContent) {
        this.routerViewWidth = window.innerWidth - 190
        this.navigationHeaderViewWidth = window.innerWidth - 190
      }
    },
    async getNotifications () {
      try {
        let pageNumber = this.loadNotifications.get('page_number')
        if (pageNumber > this.totalNotificationPages)
          return

        let data = await this.loadNotifications.fetch()
        this.totalNotificationPages = data.getData().total_pages
        this.notifications.add(this.loadNotifications.getModels())
        pageNumber++
        this.loadNotifications.set('page_number', pageNumber)
        this.loadNotifications.clear()
      } catch (err) {
        console.error(err)
      }
    },
    async getLanguages () {
      try {
        let data = await this.languages.fetchAll()
        for (let language of data.getData().items)
          this.i18n.setLocaleMessage(language.language_name, {})
      } catch (err) {
        console.error(err)
      }
    },
    async geti18nLocaleMessages (languageId) {
      try {
        window._18n = this.i18n
        this.language.set('id', languageId)
        await this.language.fetch()
        this.i18n.locale = this.language.get('language_name')
        let languageMessage = {}
        for (let message of this.language.get('language_messages'))
          languageMessage[message.language_message_key] = message.language_message_value
        this.i18n.setLocaleMessage(this.language.get('language_name'), languageMessage)
      } catch (err) {
        console.error(err)
      }
    },
    hideRibbonSuccessNotification () {
      this.appSuccessMessage = ''
    },
    removeLastRibbonStatusNotification () {
      if (this.statusMessages.length) {
        this.statusMessages.shift()
        return
      }
      window.clearInterval(windowIntervalRemove)
      windowIntervalRemove = null
    },
    removeRibbonById (key) {
      if (!this.statusMessages.length)
        return

      let index = -1
      for (let i in this.statusMessages) {
        if (key === this.statusMessages[i].key) {
          index = i
          return
        }
      }
      this.statusMessages.splice(index, 1)
    },
  },
}
</script>

<style scoped lang="css">

#router-view {
  margin: auto;
  padding: 0 10px;
  position: static;
  transition-duration: 100ms;
  transition: all 1s ease-in-out;
}

#app-wrapper {
  background-color: var(--main-body-bg-color);
  display: flex;
  height: 100%;
  overflow: hidden;
  position: relative;
  transition: background-color 1s ease;
  width: 100%;
  z-index: 1;
}

#content {
  margin: 0 auto 0 auto;
  position: relative;
  width: 100%;
}

.full-content-width {
  width: calc(100% - 340px) !important;
}

.full-content {
  width: 100% !important;
}

footer {
  -webkit-user-select: none;
  bottom: 4px;
  color: var(--main-text-color);
  display: flex;
  justify-content: center;
  position: absolute;
  user-select: none;
  width: 100%;
  z-index: 0;
}

footer span {
  align-self: center;
  display: flex;
  font-size: var(--main-font-size);
  margin: auto 5px auto 5px;
}

footer img {
  display: flex;
  position: relative;
  top: -1px;
  width: 100px;
}

.left-menu-wrapper {
  position: relative;
  z-index: 3;
}

#ribbon-status {
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  position: fixed;
  right: 0;
  z-index: 3;
}

footer a {
  outline: none;
}



#button-feedback {
  align-content: center;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  background-color: var(--main-accent-color);
  border-radius: 100%;
  bottom: 10px;
  box-shadow: var(--main-box-shadow);
  cursor: pointer;
  display: flex;
  height: 38px;
  justify-content: center;
  left: 4px;
  position: fixed;
  width: 38px;
  z-index: 4;
}

.bounce-animation {
  animation-name: bounce-animation;
  animation-timing-function: ease;
}

#button-feedback i {
  color: white;
  font-size: 22px;
  line-height: 1;
  margin: auto;
}

@keyframes bounce-animation {
  0%   { transform: scale(1,1)      translateY(0); }
  10%  { transform: scale(1.1,.9)   translateY(0); }
  30%  { transform: scale(.9,1.1)   translateY(-50px); }
  50%  { transform: scale(1.05,.95) translateY(0); }
  57%  { transform: scale(1,1)      translateY(-7px); }
  64%  { transform: scale(1,1)      translateY(0); }
  100% { transform: scale(1,1)      translateY(0); }
}



#modal-wrapper {
  background-color: var(--main-notification-bkg);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
}

#modal-box {
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  bottom: 0;
  box-shadow: var(--main-box-shadow);
  display: flex;
  flex-direction: column;
  height: calc(70% - 20%);
  left: 0;
  margin: auto;
  max-width: 480px;
  padding: 10px;
  position: absolute;
  right: 0;
  top: 0;
  width: calc(100% - 20%);
}

#modal-box h2 {
  color: var(--main-accent-color);
  flex-grow: 0;
  font-size: var(--main-font-size);
  text-transform: uppercase;
}

#modal-buttons-wrapper {
  bottom: 6px;
  display: flex;
  flex-grow: 0;
  justify-content: flex-end;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  width: calc(100% - 12px);
  z-index: 1;
}

#modal-content {
  color: var(--main-text-color);
  flex-grow: 1;
  font-size: var(--main-font-size);
  font-weight: 600;
  height: 100px;
  margin: 0 0 35px 0;
  position: relative;
}


#modal-content .scroll-area {
  padding: 0 10px 0 0;
}


.loading-bar-custom {
  left: 0;
  right: 0;
  top: 0;
  width: 100% !important;
}

</style>

<style lang="css">

.form-wrapper {
  display: grid;
  gap: 10px;
}

.transition-wrapper {
  transition-duration: 100ms;
}

/*NOTE: ANIMATION FOR SPLASH SCREEN AND LOGIN*/
.animation-transition-enter-active {
  transition: all 1s ease-in;
}
.animation-transition-leave-active {
  transition: all 1s ease-out;
}
.animation-transition-enter {
  opacity: 1;
}
.animation-transition-leave-to {
  opacity: 0;
}

/*NOTE: TRANSITION FOR ROUTER ENTER FROM RIGHT AND LEAVE TO LEFT*/
.route-transition-enter-active {
  transition: all .3s ease-in;
}
.route-transition-leave-active {
  transition: all .3s ease-out;
}
.route-transition-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.route-transition-enter {
  opacity: 1;
  transform: translateX(0px);
}
.route-transition-leave-from {
  opacity: 1;
  transform: translateX(0px);
}
.route-transition-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}


/*NOTE: ANIMATION FOR DROP UP*/
.dropup-transition-enter-active {
  transition: all .3s ease-in;
}
.dropup-transition-leave-active {
  transition: all .3s ease-out;
}
.dropup-transition-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.dropup-transition-enter {
  opacity: 1;
  transform: translateY(0px);
}
.dropup-transition-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
.dropup-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/*NOTE: ANIMATION FOR DROP DOWN*/
.dropdown-transition-enter-active {
  transition: all .3s ease-in;
}
.dropdown-transition-leave-active {
  transition: all .3s ease-out;
}
.dropdown-transition-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.dropdown-transition-enter {
  opacity: 1;
  transform: translateY(0px);
}
.dropdown-transition-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
.dropdown-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}


/*NOTE: ANIMATION FROM LEFT TO RIGHT TO LEFT*/
.openleft-transition-enter-active {
  transition: all .3s ease-in;
}
.openleft-transition-leave-active {
  transition: all .3s ease-out;
}
.openleft-transition-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.openleft-transition-enter {
  opacity: 1;
  transform: translateX(0px);
}
.openleft-transition-leave-from {
  opacity: 1;
  transform: translateX(0px);
}
.openleft-transition-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/*NOTE: ANIMATION FROM LEFT TO RIGHT TO LEFT*/
.openright-transition-enter-active {
  transition: all .3s ease-in;
}
.openright-transition-leave-active {
  transition: all .3s ease-out;
}
.openright-transition-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.openright-transition-enter {
  opacity: 1;
  transform: translateX(0px);
}
.openright-transition-leave-from {
  opacity: 1;
  transform: translateX(0px);
}
.openright-transition-leave-to {
  opacity: 0;
  transform: translateX(10px);
}


/*NOTE: ANIMATION FROM BACK TO FRONT*/
.openback-transition-enter-active {
  transition: all .2s ease-in;
}
.openback-transition-leave-active {
  transition: all .2s ease-out;
}
.openback-transition-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.openback-transition-enter {
  opacity: 1;
  transform: scale(1)
}
.openback-transition-leave-from {
  opacity: 1;
  transform: scale(0.5);
}
.openback-transition-leave-to {
  opacity: 0;
  transform: scale(1);
}







.material-symbols-rounded {
  font-size: var(--main-icon-font-size);
}

.ps {
  z-index: 0;
  transition-duration: .25s;
}

.ps:hover {
  transition: none !important;
  opacity: 1 !important;
}

.scroll-area {
  margin: 0;
  position: relative;
}


.ps__rail-y {
  background-color: transparent !important;
  width: 6px;
}

.ps__thumb-y {
  width: 6px !important;
  background-color: var(--main-accent-color) !important;
  border-radius: 2px !important;
}

.ps__rail-x {
  background-color: transparent !important;
  height: 6px !important;
}

.ps__thumb-x {
  height: 6px !important;
  background-color: var(--main-accent-color) !important;
}


.ps-router-view {
  z-index: 1;
}

.ps-router-view > .ps__rail-y {
  z-index: 2;
}



::placeholder {
  color: var(--main-text-color);
  opacity: 1 !important;
}


table {
  border-collapse: collapse;
  border-spacing: 0;
  color: var(--main-text-color);
  margin: 10px 0 40px 0;
  min-width: 720px;
  table-layout: fixed;
  width: 100%;
}

tr td {
  word-break: break-all;
}

tbody tr td:first-child,
thead tr td:first-child {
  padding-left: 8px;
}

tbody tr td:last-child,
thead tr td:last-child {
  padding-right: 8px;
}

thead tr td {
  background-color: var(--main-box-bg-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  height: 30px;
  padding: 0;
  position: -webkit-sticky;
  position: sticky;
  z-index: 1;
}

thead tr td {
  top: 0;
}

tbody tr td {
  cursor: pointer;
  font-size: var(--main-font-size);
  padding: 0;
}

tbody tr:nth-child(even) {
  background-color: rgba(200, 200, 200, 0.10);
}

tbody tr:hover {
  background-color: var(--main-hover-color);
}

tbody tr td:first-child {
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
}

tbody tr td:last-child {
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
}

tbody tr {
  height: 36px;
}

tbody tr td p {
  padding: 0;
  margin: 0;
}


.right-menu-wrapper {
  position: relative;
  z-index: 3;
}
.right-menu-wrapper.sticky {
  z-index: 3;
}


.tip {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
}

.tip > span {
  font-weight: 700;
  padding-right: 6px;
}


.info {
  color: var(--main-secondary-text-color);
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  margin: 0;
  position: relative;
  text-transform: uppercase;
  width: 100%;
  z-index: 1;
}

</style>
