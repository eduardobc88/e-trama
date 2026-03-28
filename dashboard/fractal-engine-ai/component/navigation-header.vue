<template lang="html">
  <div>
    <div id="header-wrapper"
      v-bind:style="{
        width: `${ width }px`
      }">
      <div
        id="content">
        <div id="title-wrapper">
          <NavigationButtons/>
          <div
            id="title">
            <div id="breadcrumbs">
              <template v-for="(data, index) of breadCrumbs">
                <a v-on:click="bcTo(data)">
                  <i
                    class="material-symbols-rounded icon">
                    {{ data.icon }}
                  </i>
                  {{ $t(data.title) }}
                </a>
              </template>
            </div>
          </div>
        </div>
        <p
          id="description">
          {{ $t(headerDescription) }}
        </p>
        <div id="actions">
          <slot></slot>
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

import NavigationButtons from './navigation-buttons.vue'

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 0,
    },
  },
  components: {
    NavigationButtons,
  },
  data () {
    return {
      breadCrumbs: [],
      router: useRouter(),
      route: useRoute(),
      headerDescription: '',
      isFullContent: false,
    }
  },
  created () {
    if (this.route.meta.description !== undefined)
      this.headerDescription = this.route.meta.description
    this.router.afterEach((to, from) => {
      this.headerDescription = to.meta.description
      this.updateBreadCrumbs()
    })
    this.updateBreadCrumbs()
  },
  methods: {
    updateBreadCrumbs () {
      let bc = [
        {
          name: 'wellcome',
          params: {},
          title: 'home',
          icon: 'home_app_logo',
        },
      ]
      let pathArr = this.route.path.split('/')
      let title = this.route.name.replaceAll('-', ' ')
      title = title.replaceAll('records', '')
      title = title.replaceAll('record', '')
      if (pathArr.indexOf('record') >= 0) {
        name = this.route.name.replaceAll('-record', '')
        bc.push({
          name: `${ name }-records`,
          params: {
            page: 1,
          },
          title: `${ title } records`,
          icon: 'library_books',
        })
        bc.push({
          name: '',
          params: {},
          title:  `${ title } record`,
          icon: this.route.meta.icon,
        })
      } else if (pathArr.indexOf('records') >= 0)
        bc.push({
          name: '',
          params: {},
          title: `${ title } records`,
          icon: 'library_books',
        })
      else
        bc.push({
          name: '',
          params: {},
          title: title,
          icon: this.route.meta.icon,
        })
      this.breadCrumbs = bc
    },
    bcTo (data) {
      if (data.name === '')
        return

      this.router.push({
        name: data.name,
        params: data.params,
      })
    },
  },
}
</script>

<style scoped lang="css">

#header-wrapper {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  left: 0;
  margin: 0 0 0 auto;
  padding: 60px 10px 0 10px;
  position: absolute;
  right: 0;
  z-index: 2;
}

#content {

}

#title-wrapper {
  display: flex;
  padding: 0 10px;
}

#title {
  display: flex;
  flex-grow: 0;
}

#title > div {
  display: flex;
  position: relative;
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

#description {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  margin: 5px auto 0 auto;
  overflow: hidden;
  padding: 0;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
  width: calc(100% - 140px);
}

#breadcrumbs {
  display: flex;
  gap: 10px;
  margin: 0 0 0 10px;
}

#breadcrumbs a {
  align-items: center;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  margin: 0 5px 0 0;
  position: relative;
  text-transform: uppercase;
}

#breadcrumbs a:hover {
  color: var(--main-text-color);
}

#breadcrumbs a:before {
  align-content: center;
  align-self: center;
  bottom: 0;
  color: var(--main-text-color);
  content: "/";
  font-size: calc(var(--main-accent-font-size) - 2px);
  left: -10px;
  margin: auto;
  position: absolute;
  top: 0;
}

#breadcrumbs a .icon {
  margin: auto 2px auto 0;
  font-size: calc(var(--main-accent-font-size) + 4px);
}

</style>
