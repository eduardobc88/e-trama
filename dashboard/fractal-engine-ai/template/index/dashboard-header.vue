<template lang="html">
  <div>
    <div
      id="header"
      v-window-resize="onResizeWindow">
      <div id="content">
        <div
          class="left-wrapper"
          v-bind:style="headerLeftRightStyle">
          <router-link
            id="areaname"
            :to="{ name: 'wellcome', params: '' }">
            <div
              :key="uuidArea"
              class="avatar"
              v-bind:style="getStyles(profile.get('area_id_ref'))">
              <span>
                {{ getUserFirstLetter(profile.get('area_id_ref')) }}
              </span>
            </div>
            <div
              v-if="isDesktopScreen"
              class="area-name">
              <p class="data-key">
                {{ $t('area') }}
              </p>
              <p class="data-value">
                {{ profile.get('area_id_ref') }}
              </p>
            </div>
          </router-link>
          <div
            class="header-buttons-wrapper">
            <ButtonIcon
              v-if="isDesktopScreen"
              v-bind:buttonIcon="getMenuIconName()"
              v-bind:buttonAction="toggleFullContent"
              class="menu-button header-button"/>
            <ButtonIcon
              v-if="isFullContent"
              buttonIcon="apps"
              v-bind:buttonAction="toggleMenuDalay"
              class="menu-button header-button"/>
          </div>
        </div>
        <div
          class="center-wrapper">
          <div
            id="search-wrapper"
            v-bind:class="{ 'search-active': resultsIsVisible }"
            v-click-outside="clickOutsite">
            <LoadingBar
              v-show="isLoading"
              style="margin: 0; width: 100%;"/>
            <i
              id="icon-search"
              class="material-symbols-rounded">
              search
            </i>
            <input
              type="text"
              v-bind:placeholder="((searchIsFocused)?'':$t('search'))"
              v-model="searchValue"
              v-on:focus="onChangeSearchValueThrottle"/>
            <div class="bkg">
              <img
                v-if="!resultsIsVisible && !searchIsFocused && searchValue === ''"
                id="app-logo"
                src="/static/dashboard/fractal-engine-ai/assets/logo.png"
                v-on:click="toggleMenuDalay"/>
            </div>
            <transition name="dropdown-transition" mode="out-in">
              <div v-if="resultsIsVisible" id="search-results">
                <perfect-scrollbar
                  v-if="resultsIsVisible"
                  id="search-scroll"
                  v-bind:options="{
                    suppressScrollX: true,
                  }">
                  <div
                    id="no-results"
                    v-if="!searchItems.getModels().length">
                    {{ $t('without results') }}
                  </div>
                  <div
                    :key="uuidResults"
                    id="items-wrapper">
                    <template
                      v-for="item in searchItems.getModels()">
                      <div
                        class="item"
                        v-on:click="onClickResult">
                        <div
                          v-if="item.get('item_model') !== 'local_page'"
                          v-on:click="goToModelDetail(item)">
                          <i class="material-symbols-rounded icon">
                            {{ item.get('item_icon') }}
                          </i>
                          <label>
                            {{ item.get('item_title') }}
                          </label>
                          <span
                            class="chip detail">
                            {{ $t('detail') }}
                          </span>
                          <span
                            class="chip model"
                            v-bind:style="getStyles(item.get('item_model'))">
                            {{ item.get('item_model') }}
                          </span>
                        </div>
                        <div
                          v-if="item.get('item_model') === 'local_page'"
                          v-on:click="goToLocalPage(item)">
                          <i class="material-symbols-rounded icon">
                            {{ item.get('item_icon') }}
                          </i>
                          <label>
                            {{ item.get('item_title') }}
                          </label>
                          <span
                            v-if="item.get('item_icon') !== 'list'"
                            class="chip new">
                            {{ $t('new') }}
                          </span>
                          <span
                            v-if="item.get('item_icon') === 'list'"
                            class="chip list">
                            {{ $t('list') }}
                          </span>
                        </div>
                      </div>
                    </template>
                  </div>
                </perfect-scrollbar>
              </div>
            </transition>
            <div
              v-if="searchValue"
              id="search-close-button">
              <ButtonIcon
                buttonIcon="close"
                v-bind:buttonAction="clearAndhideResults"/>
            </div>
          </div>
        </div>
        <div
          class="right-wrapper"
          v-bind:style="headerLeftRightStyle">
          <div
            class="header-buttons-wrapper">
            <ButtonIcon
              buttonIcon="history"
              v-bind:buttonAction="showSidebarNotification"/>
          </div>
          <div
            class="username"
            v-on:click="showUserMenu"
            v-click-outside="hideUserMenu">
            <div
              v-if="isDesktopScreen"
              class="name">
              <p class="data-key">
                {{ profile.get('user_first_name') }}
              </p>
              <p class="data-value">
                {{ profile.get('role_name') }}
              </p>
            </div>
            <div
              class="avatar"
              v-if="profile.get('profile_file_id')"
              v-bind:style="getCoverImage()">
            </div>
            <div
              :key="uuidUser"
              class="avatar"
              v-if="!profile.get('profile_file_id')"
              v-bind:style="getStyles(profile.get('user_first_name'))">
              <span>
                {{ getUserFirstLetter(profile.get('user_first_name')) }}
              </span>
            </div>
            <transition name="dropdown-transition" mode="out-in">
              <div
                class="menu"
                v-if="userMenuOpen">
                <div class="options-wrapper">
                  <div
                    class="option"
                    v-on:click="showUserProfile(profile)">
                    <i class="material-symbols-rounded option-icon">
                      person
                    </i>
                    {{ $t('profile') }}
                  </div>
                  <div
                    class="option"
                    v-on:click="onClickLogout">
                    <i class="material-symbols-rounded option-icon">
                      input
                    </i>
                    {{ $t('logout') }}
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {
  useRouter,
  useRoute
} from 'vue-router'

import ButtonIcon from '../../component/button-icon.vue'
import LoadingBar from '../../component/loading-bar.vue'
import {boolean} from "../../resource/base-mc/vue-mc/validation";


export default {
  props: {
    isFullContent: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      uuidArea: this.$uuid.v1(),
      uuidUser: this.$uuid.v1(),
      uuidResults: this.$uuid.v1(),
      router: useRouter(),
      route: useRoute(),
      searchValue: '',
      resultsIsVisible: false,
      searchItems: new this.$model.SearchMC.collection(),
      profile: new this.$model.ProfileMC.model(),
      userMenuOpen: false,
      settings: new this.$model.DashboardSettingMC.model(),
      isDesktopScreen: true,
      headerLeftRightStyle: '',
      toggleMenuDalay: this.toggleMenu,
      isLoading: false,
      onChangeSearchValueThrottle: _.throttle(this.onChangeSearchValue, 100, { 'trailing': false }),
      searchIsFocused: false,
    }
  },
  components: {
    ButtonIcon,
    LoadingBar,
  },
  watch: {
    searchValue (newVal, oldVal) {
      this.onChangeSearchValueThrottle()
    },
  },
  created () {
    this.toggleMenuDalay = _.debounce(this.toggleMenu, 200)
    this.createModelEventListener()
    this.getData()
    this.$emitter.on('dashboard-change-theme', () => {
      this.uuidArea = this.$uuid.v1()
      this.uuidUser = this.$uuid.v1()
      this.uuidResults = this.$uuid.v1()
    })
  },
  beforeDestroy () {
    this.removeModelEventListener()
  },
  mounted () {
    this.onResizeWindow()
  },
  methods: {
    createModelEventListener () {
      this.profile.on('notification', event => {
        this.$config.user_data = this.profile
        this.$i18n.locale = this.profile.get('language_id_ref')
        this.$emitter.emit('dashboard-app-user-loaded', '')
        this.$emitter.emit('app-user-profile-updated')
        this.$emitter.emit('app-user-language', this.profile.get('language_id'))
      })
    },
    removeModelEventListener () {
      this.profile.off('notification')
    },
    onResizeWindow () {
      if (window.innerWidth <= 640) {
        this.isDesktopScreen = false
        this.headerLeftRightStyle = 'min-width: 50px;'
      } else {
        this.isDesktopScreen = true
        this.headerLeftRightStyle = 'min-width: 180px;'
      }
    },
    showSidebarNotification () {
      this.$emitter.emit('app-show-sidebar-activity', '')
    },
    toggleMenu (e) {
      if (e !== undefined)
        e.preventDefault()
      this.$emitter.emit('app-show-sidebar-menu', '')
    },
    toggleFullContent () {
      this.$emitter.emit('app-toggle-full-content', '')
    },
    getMenuIconName () {
      if (this.isFullContent)
        return 'fullscreen'
      return 'fullscreen_exit'
    },
    async onChangeSearchValue () {
      this.searchIsFocused = true
      if (!this.searchValue)
        return

      let localItems = []
      let search = this.searchValue.toLowerCase()
      let resourceViewNames = []
      for (let rr of this.$config.user_data.get('role_resources'))
        if (rr.permission.includes('v'))
          resourceViewNames.push(rr.name)
      const routes = []
      for (let route of this.router.options.routes)
        for (let resourceViewName of resourceViewNames)
          if (route.name.includes(resourceViewName))
            routes.push(route)
      for (let route of routes) {
        let title = route.meta.title.toLowerCase()
        let routeName = route.name
        if (
          (title.includes(search) || routeName.includes(search)) &&
          !routeName.includes('not-found')
        ) {
          let path = route.path
          let icon = 'list'
          let params = {
            page: 1,
          }
          if (path.indexOf(':page') === -1 ) {
            params = ''
            icon = 'insert_drive_file'
          }
          localItems.push({
            'item_title': title,
            'item_model': 'local_page',
            'item_params': params,
            'page_route_name': routeName,
            'item_icon': icon,
          })
        }
      }
      this.isLoading = true
      this.searchItems.clear()
      this.showResults()
      try {
        await this.searchItems.fetch({
            params: {
              search: this.searchValue,
            },
          })
        this.searchItems.add(localItems)
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    onClickResult () {
      this.hideResults()
    },
    clickOutsite () {
      this.searchIsFocused = false
      this.hideResults()
    },
    showResults () {
      this.resultsIsVisible = true
    },
    clearAndhideResults () {
      this.searchValue = ''
      this.resultsIsVisible = false
    },
    hideResults () {
      this.resultsIsVisible = false
    },
    goToModelDetail (item) {
      this.router.push({
        name: `${ item.get('item_model') }-record`,
        params: { id: item.get('item_id') },
      })
    },
    goToLocalPage (page) {
      this.router.push({
        name: page.page_route_name,
        params: page.item_params,
      })
    },
    showUserProfile (profile) {
      this.router.push({
        name: 'profile',
      })
    },
    showUserMenu () {
      this.userMenuOpen = true
    },
    hideUserMenu () {
      this.userMenuOpen = false
    },
    getData () {
      try {
        this.profile.set('id', this.$getCookie('user_id'))
        this.profile.fetch()
      } catch (err) {
        console.error(err)
      }
    },
    getDashboardData () {
      try {
        this.settings.fetch()
      } catch (err) {
        console.error(err)
      }
    },
    getCoverImage () {
      let style = ''
      style += `background-image: url("/upload/${ this.profile.get('area_id') }/${ this.profile.get('profile_file_id_ref') }");`
      style += 'background-size: cover;'
      style += 'background-position: center;'
      return style
    },
    getUserFirstLetter (value) {
      if (value === undefined || value === null || value === '')
        return

      return value[0]
    },
    getStyles (text) {
      if (text === '' || text === undefined || text === null)
        text = '.'
      text = `${ text }${ text.length }`
      let style = this.$getHexColor(text, false, 20, 50, 100)
      if (this.$config.is_light_theme)
        style = this.$getHexColor(text, false, 40, 80, 100)
      return style
    },
    async onClickLogout () {
      try {
        let data = await this.$axios.put(this.$config.logout_api_url, {}, {
          headers: {
            'csrf-token': this.$getCookie('csrf-token'),
          },
        })
        this.$emitter.emit('app-show-splash-screen', {})
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>

<style scoped lang="css">
#header {
  height: 50px;
  left: 0px;
  position: absolute;
  right: 0px;
  top: 0;
  width: 100%;
  z-index: 4;
}

#content {
  color: var(--main-text-color);
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  height: 100%;
  left: 0px;
  position: absolute;
  right: 0px;
  top: 0;
  width: 100%;
}

.left-wrapper, .right-wrapper {
  -webkit-user-select: none;
  display: flex;
  min-width: 180px;
  position: relative;
  text-overflow: ellipsis;
  user-select: none;
}

.center-wrapper {
  display: flex;
}

.right-wrapper {
  justify-content: flex-end;
}

.username {
  align-self: center;
  cursor: pointer;
  display: flex;
  max-width: 160px;
  padding-right: 10px;
  position: relative;
}

.username .name {
  align-self: center;
  color: var(--main-text-color);
  cursor: pointer;
  flex-grow: 1;
  line-height: 1;
  margin: 0 5px 0 0;
  max-width: 100px;
  overflow: hidden;
  position: relative;
  text-align: right;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 1;
}

.avatar {
  align-self: center;
  border-radius: 6px;
  box-shadow: var(--main-box-shadow);
  color: var(--main-text-color);
  display: flex;
  flex-grow: 0;
  height: 28px;
  justify-content: center;
  min-width: 28px;
  z-index: 1;
}

.avatar span {
  align-self: center;
  font-size: 18px;
  font-weight: 300;
  text-transform: uppercase;
}

.username .menu {
  background-color: var(--main-box-bg-color-op);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  max-height: calc(100vh - 64px);
  overflow: hidden;
  padding: 10px;
  position: absolute;
  right: 10px;
  top: 45px;
  width: 140px;
}

.options-wrapper {
  box-sizing: border-box;
  overflow: hidden;
}

.username .menu .option {
  border-radius: 10px;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  max-width: 100%;
  padding: 8px;
  text-decoration: none;
  text-transform: uppercase;
  z-index: 1;
  position: relative;
}

.username .menu .option:last-child {
  color: var(--main-color-error) !important;
  background-color: var(--main-error-bkg-op) !important;
}

.username .menu .option:hover {
  background-color: var(--main-hover-color);
}

.username .menu .option:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

#search-wrapper {
  align-self: center;
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow-light);
  display: flex;
  margin: auto;
  min-width: 150px;
  position: relative;
  width: 100%;
}

#icon-search,
#search-wrapper .icon {
  align-self: center;
  display: flex;
  position: absolute;
}

#icon-search {
  margin-left: 6px;
  z-index: 2;
}

#search-wrapper input {
  align-self: center;
  background: none;
  border: none;
  box-sizing: border-box;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-font-size);
  font-weight: 500;
  height: 40px;
  outline: none;
  padding: 0 35px;
  position: absolute;
  width: 100%;
  z-index: 1;
}

#search-wrapper input::-webkit-input-placeholder {
  color: var(--main-secondary-text-color);
  text-transform: uppercase;
}

#search-wrapper .bkg {
  align-self: center;
  background-color: var(--main-menu-bkg);
  border-radius: 10px;
  display: flex;
  height: 40px;
  pointer-events: none;
  position: relative;
  transition: background-color 1s ease;
  width: 100%;
}

#search-wrapper.search-active .bkg {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  z-index: 1;
}

#search-wrapper.search-active input {
  color: var(--main-text-color);
  z-index: 2;
}

.item {
  width: calc(100% - 20px);
  margin: auto;
}

.item > div {
  border-radius: 8px;
  box-sizing: border-box;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-accent-font-size);
  height: auto;
  padding: 6.5px;
  text-transform: uppercase;
  width: 100%;
}

.item > div:hover {
  background-color: var(--main-hover-color);
}

.item > div:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

.item > div:active i {
  color: var(--main-text-color);
}

.item > div {
  align-self: center;
  display: flex;
  margin: 0;
}

.item  > div .material-icons {
  align-self: center;
  font-size: 20px;
  margin-right: 5px;
  pointer-events: none;
}

.item > div label {
  align-self: center;
  margin-right: 20px;
  padding: 0 0 0 25px;
  pointer-events: none;
}

#no-results {
  align-content: center;
  color: var(--main-text-color);
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  height: 100%;
  justify-self: center;
  position: relative;
  text-transform: uppercase;
  z-index: 1;
}

.option-icon {
  font-size: 16px;
  margin: auto 6px auto 0;
}

#areaname {
  align-self: center;
  cursor: pointer;
  display: flex;
  max-width: 160px;
  padding-left: 10px;
  position: relative;
  text-decoration: none;
}

.area-name {
  align-self: center;
  color: var(--main-text-color);
  cursor: pointer;
  flex-grow: 1;
  line-height: 1;
  margin: 0 5px 0 5px;
  max-width: 100px;
  overflow: hidden;
  position: relative;
  text-align: left;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 1;
}

.data-key {
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  margin: 0px;
  text-transform: uppercase;
}

.data-value {
  display: block;
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  color: var(--main-secondary-text-color);
}

#search-close-button {
  -webkit-user-select: none;
  align-self: center;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  position: absolute;
  right: 5px;
  user-select: none;
  z-index: 2;
}

#search-results {
  background-color: var(--main-menu-bkg);
  border-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 0 !important;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  left: -1px;
  overflow: hidden;
  padding: 10px 0 0 0;
  position: absolute;
  right: -1px;
  top: 30px;
  width: 100%;
}

#search-scroll {
  height: 100%;
  max-height: 320px;
}

#items-wrapper {
  padding: 0 0 10px 0;
}

#app-logo {
  align-self: center;
  cursor: pointer;
  display: flex;
  filter: drop-shadow(0px 0px 16px rgba(255, 255, 255, 0.5));
  height: 38px;
  margin: auto;
  pointer-events: none;
  position: relative;
  top: -1px;
}

.header-buttons-wrapper {
  display: flex;
  position: relative;
  justify-content: space-between;
  gap: 6px;
  margin: 0 6px;
}

.header-buttons-wrapper div {
  margin: auto;
}


@media all and (max-width: 1080px) {
  #search-wrapper {
    margin: 0;
  }
}

.item .chip {
  background-color: var(--main-hover-color);
  border-radius: 10px;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  justify-content: center;
  line-height: calc(var(--main-secundary-font-size) + 6px);
  margin: 0 0 0 5px;
  padding: 0 15px;
  text-transform: uppercase;
}

</style>
