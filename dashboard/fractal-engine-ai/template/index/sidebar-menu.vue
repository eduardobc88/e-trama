<template lang="html">
  <div>
    <div
      id="menu"
      v-bind:class="{
        'sticky': isSticky,
        'no-sticky': !isSticky,
        }"
      v-click-outside="afterClose">
      <perfect-scrollbar id="scroll-bar">
        <div
          id="items"
          v-bind:style="{
            height: `${ componentHeight }px`,
          }">
          <template
            v-if="showMenu">
            <template
              v-for="(item, index) in menuItems">
              <div
                v-if="$aclUserCan(item.resourceName)"
                ref="menu-option"
                class="menu-option">
                <router-link
                  v-bind:key="item.position"
                  :to="{ name: item.name, params: item.params }"
                  v-bind:class="getMenuItemClass(item)">
                  <i class="material-symbols-rounded icon">
                    {{ item.icon }}
                  </i>
                  {{ $t(item.title) }}
                </router-link>
                <i
                  v-if="item.children"
                  class="material-symbols-rounded button-more-items"
                  v-on:click="toggleOptions(index)">
                  {{ item.expanded ? 'expand_less' : 'expand_more' }}
                </i>
                <router-link
                  v-if="item.expanded"
                  class="children-item"
                  v-for="(itemChildren) of item.children"
                  v-bind:key="itemChildren.uuid"
                  :to="{ name: itemChildren.name, params: '' }">
                  <i class="material-symbols-rounded icon">
                    {{ itemChildren.icon }}
                  </i>
                  {{ $t(itemChildren.title) }}
                </router-link>
              </div>
            </template>
          </template>
          <div id="menu-footer"></div>
        </div>
      </perfect-scrollbar>
    </div>
    <div
      class="shadow"
      v-if="!isSticky">
    </div>
  </div>
</template>

<script>

import {
  useRouter,
  useRoute
} from 'vue-router'

export default {
  components: {

  },
  props: {
    isSticky: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      showMenu: false,
      categoryCollection: new this.$model.CategoryMC.collection(),
      afterClose: _.after(2, this.close),
      currentItemName: '',
      menuItems: [],
      componentHeight: 0,
    }
  },
  created () {
    this.setComponentProps()
    this.generateMenuItems()
    this.highlightCurrentMenuItem(this.route.name)
    this.router.beforeResolve(this.routerBeforeResolve)
    setTimeout(() => {
      this.showMenu = true
    }, 200)
  },
  methods: {
    setComponentProps () {
      this.componentHeight = window.innerHeight - ((this.isSticky)?50:30)
    },
    generateMenuItems () {
      let menuItems = []
      let p = 1
      let title = ''
      for (let i of this.$config.user_data.get('role_resources')) {
        if (!i.menu)
          continue

        for (let r of this.router.getRoutes()) {
          if (r.name === i.name || r.name === `${ i.name }-record`  || r.name === `${ i.name }-records`) {
            title = i.name.replaceAll('-', ' ')
            if (i.records)
              menuItems.push({
                uuid: this.$uuid.v1(),
                position: p++,
                title: title,
                name: `${ i.name }-records`,
                icon: i.icon,
                params: { page: 1 },
                resourceName: i.name,
                keys: i.name,
                expanded: false,
                children: [
                  {
                    title: 'new',
                    name: `${ i.name }-record`,
                    icon: 'add',
                    uuid: '',
                  },
                ],
              })
            else
              menuItems.push({
                uuid: this.$uuid.v1(),
                position: p++,
                title: title,
                name: i.name,
                icon: i.icon,
                resourceName: i.name,
                keys: i.name,
                expanded: false,
              })
            break
          }
        }
      }
      this.menuItems = menuItems
    },
    close () {
      if (this.isSticky)
        return

      this.$emitter.emit('app-hide-sidebar-menu', '')
    },
    highlightCurrentMenuItem (itemName) {
      if (itemName === undefined)
        return

      itemName = itemName.replaceAll('-records', '')
      itemName = itemName.replaceAll('-record', '')
      let name = ''
      let index = -1
      let isMatch = false
      for (let itemIndex in this.menuItems) {
        let regx = new RegExp(`^${ itemName }$`, 'gi')
        let itemKeys = this.menuItems[itemIndex].keys.replace(/\s/gi, '').split(',')
        for (let itemKey of itemKeys) {
          let match = itemKey.match(regx)
          if (match) {
            name = this.menuItems[itemIndex].name
            index = itemIndex
            isMatch = true
            // NOTE: check for children
            let children = this.menuItems[itemIndex].children
            if (children !== undefined)
              for (let child of children)
                if (child.keys !== undefined && child.keys.indexOf(itemName) >= 0) {
                  child.expanded = true
                  break
                }
            break
          }
        }
        if (isMatch)
          break
      }
      this.currentItemName = name
      if (!this.menuItems[index])
        return

      this.menuItems[index].expanded = true
    },
    getMenuItemClass (item) {
      return {
        'current': this.isCurrentItem(item),
        'option': true,
      }
    },
    isCurrentItem (item) {
      return item.name == this.currentItemName
    },
    routerBeforeResolve (to, from, next) {
      this.highlightCurrentMenuItem(to.name)
      next()
    },
    toggleOptions (index) {
      this.menuItems[index].expanded = !this.menuItems[index].expanded
    },
  },
}
</script>

<style scoped lang="css">
#menu {
  flex-grow: 0;
  left: 0;
  overflow-y: hidden;
  position: fixed;
  width: 190px;
  z-index: 1;
}

#scroll-bar {
  border: 1px solid transparent;
}

#items {
  margin: 0;
}

.no-sticky {
  background-color: var(--main-menu-bkg);
  box-shadow: var(--main-box-shadow);
  height: 100%;
  top: 0px;
  padding-top: 50px;
}

.sticky {
  height: 100%;
  padding-top: 50px;
}

#logo {
  align-self: center;
  display: flex;
  margin: 6px auto;
  width: 130px;
}

#menu .option {
  -webkit-user-select: none;
  align-items: center;
  border-bottom: 0;
  border-radius: 10px;
  border: 0;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  height: 35px;
  margin: 2px 6px 2px 10px;
  max-width: 100%;
  padding: 0 4px 0 10px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  transition-duration: 100ms;
  user-select: none;
  z-index: 2;
}

#menu .option:hover {
  background-color: var(--main-hover-color);
}

#menu .option:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

#menu .option .icon {
  margin-right: 5px;
}

.shadow {
  bottom: 0;
  height: 100%;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

#menu .option.current {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

.children-item {
  -webkit-user-select: none;
  align-items: center;
  border-radius: 10px;
  border: 0;
  color: var(--main-text-color);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-size: calc(var(--main-accent-font-size) - 2px);
  font-weight: 600;
  height: 30px;
  margin: 2px 6px 2px 10px;
  max-width: 100%;
  padding: 0 6px 0 10px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  transition-duration: 100ms;
  user-select: none;
  z-index: 2;
}

.children-item:hover {
  background-color: var(--main-hover-color);
}

.children-item:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

.children-item .icon {
  font-size: 18px;
  margin-right: 6px;
  padding: 0;
}

.menu-option {
  margin: 0;
  position: relative;
}

#menu-footer {
  height: 30px;
}

.button-more-items {
  -webkit-user-select: none;
  color: var(--main-text-color);
  cursor: pointer;
  font-size: 18px;
  position: absolute;
  right: 15px;
  top: 7px;
  user-select: none;
  z-index: 2;
}

</style>
