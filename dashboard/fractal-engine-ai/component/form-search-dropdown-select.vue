<template lang="html">
  <div>
    <div
      id="select-wrapper"
      v-click-outside="clickOutsite">
      <InputText
        v-bind:inputName="title"
        v-bind:inputValue="getValue()"
        v-bind:onChangeValue="throttleOnChangeValue"
        v-bind:errorMessage="errorMsg"
        v-bind:helperMessage="helpMsg"
        v-bind:isEmbededDropdown="false"
        v-bind:onFocus="onInputFocus"/>
      <transition name="dropdown-transition" mode="out-in">
        <div
          id="select-options"
          v-bind:class="{
            'top': true,
            'transition-wrapper': true,
            focus: focus,
          }"
          v-if="show"
          :key="collection._uid">
          <perfect-scrollbar class="scroll-area">
            <div class="items">
              <div
                v-if="collectionItems.length"
                class="item"
                v-on:click="onSelectEmpty()">
                {{ $t('none') }}
              </div>
              <div
                id="empty"
                v-if="!collectionItems.length">
                {{ $t('without results') }}
              </div>
              <div
                class="item"
                v-for="(option, index) in collectionItems"
                v-on:click="onSelect(option)">
                {{ option.get(propNameToShow) }}
              </div>
            </div>
          </perfect-scrollbar>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
// NOTE: use
// <FormSearchDropdownSelect
//   title="Resource"
//   helpMsg="select resource"
//   errorMsg=""
//   v-bind:collection="resourceCollection"
//   v-bind:currentValue="resourceValue"
//   v-bind:onSelectOption="onSelectOption"
//   propName="resource_id"
//   propNameToShow="resource_name"/>
//   // NOTE: data
//   resourceCollection: new this.$model.ResourceMC.collection(),
//   resourceValue: '',
//   // NOTE: method
//   onSelectOption (option) {
//     this.resourceValue = option.get('resource_name')
//   },

// NOTE: IF filterOverResults IS TRUE THEN ONLY APPLY THE REQUEST ONLY ONE TIME AND FILTER OVER THE REQUEST RESULT

import InputText from './input-text.vue'

export default {
  props: {
    'title': {
        default: '',
      },
    'onChangeInputValue': {
      default: null,
    },
    'onSelectOption': {
      default: null,
    },
    'collection': {
      default: [],
    },
    'helpMsg': {
      default: '',
    },
    'errorMsg': {
      default: '',
    },
    'currentValue': {
      default: '',
    },
    'propNameToShow': {
      default: '',
    },
    'propName': {
      default: '',
    },
    'searchInCustomEntity': {
      default: '',
    },
    'searchFunctionName': {
      default: '',
    },
    'filterOverResults': {
      default: false,
    },
  },
  data () {
    return {
      inputValue: '',
      show: false,
      throttleOnChangeValue: _.throttle(this.onChangeValue, 1000, { 'trailing': true }),
      itemSelected: null,
      collectionItems: [],
      isFilterOverResultActive: false,
      focus: false,
    }
  },
  components: {
    InputText,
  },
  methods: {
    onInputFocus (value) {
      this.focus = value
      if (!this.filterOverResults)
        return

      if (value) {
        this.show = value
        this.inputValue = ''
        this.search('')
        return
      }
      setTimeout(() => {
        this.show = value
      }, 300)
    },
    onSelect (option) {
      this.onSelectOption(option, this.propName)
      this.show = false
      this.inputValue = ''
    },
    clickOutsite (event) {
      this.inputValue = ''
      this.show = false
    },
    onChangeValue (prop, value) {
      this.inputValue = value
      this.show = true
      this.search(value)
      if (this.onChangeInputValue !== null && this.onChangeInputValue !== undefined)
        this.onChangeInputValue(value)
    },
    onSelectEmpty () {
      this.onSelectOption(null, this.propName)
      this.show = false
      this.inputValue = ''
    },
    getValue () {
      if (this.show)
        return this.inputValue

      if (this.currentValue === undefined)
        this.currentValue = ''
      return this.currentValue
    },
    async search (value) {
      // TODO: IMPROVE THIS FUNCTION
      let searchFunction = 'search'
      let searchInCustomEntity = ''
      if (this.searchFunctionName !== undefined && this.searchFunctionName.length) {
        searchFunction = this.searchFunctionName
        if (this.searchInCustomEntity !== undefined)
          searchInCustomEntity = this.searchInCustomEntity
      }
      if (this.isFilterOverResultActive) {
        this.collectionItems = this.getCollectionFiltered(value)
        return
      }
      // NOTE: UNCOMMENT FOR DON'T REQUEST MORE THAN ONE TIME
      // if (!this.isFilterOverResultActive && this.filterOverResults)
      //   this.isFilterOverResultActive = true
      if (searchInCustomEntity !== '') {
        await this.collection[searchFunction](searchInCustomEntity, {s: value})
        this.collectionItems = this.collection.getModels()
        if (this.isFilterOverResultActive)
          this.collectionItems = this.getCollectionFiltered(value)
        return
      }
      await this.collection[searchFunction]({s: value})
      this.collectionItems = this.collection.getModels()
      if (this.isFilterOverResultActive)
        this.collectionItems = this.getCollectionFiltered(value)
    },
    getCollectionFiltered (keyword) {
      let keyWordLowerCase = keyword.toLowerCase()
      let collectionFiltered = this.collection.filter(item => {
        let value = item.get('search_show')
        if (value.toString().length && value.toString().toLowerCase().includes(keyWordLowerCase))
          return true
        return false
      })
      return collectionFiltered.getModels()
    },
  },
}
</script>

<style scoped lang="css">
#select-options {
  background-color: var(--main-box-bg-color-op);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom: 1px solid var(--main-active-color);
  border-left: 1px solid var(--main-active-color);
  border-right: 1px solid var(--main-active-color);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 0;
  box-shadow: var(--main-box-shadow);
  left: 0;
  list-style: none;
  margin: 0;
  max-width: 480px;
  overflow: auto;
  position: absolute;
  right: 0;
  top: 45px;
  width: calc(100% - 2px);
  z-index: 2;
}

#select-options.focus {
  border-bottom: 1px solid var(--main-accent-color);
  border-left: 1px solid var(--main-accent-color);
  border-right: 1px solid var(--main-accent-color);
}

.embeded #select-options {
  top: 21px;
}

#select-options .scroll-area {
  max-height: 150px;
}

#select-wrapper {
  background-color: transparent;
  display: block;
  flex-direction: column;
  max-width: 480px;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
}

#select-wrapper.embeded {
  height: auto;
  padding: 0;
}

#input-title {
  background-color: transparent;
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  left: 6px;
  padding: 0 4px;
  pointer-events: none;
  position: absolute;
  text-transform: uppercase;
  top: 4px;
  transition-duration: 50ms;
}

input {
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--main-border-color);
  box-sizing: border-box;
  caret-color: var(--main-accent-color);
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  line-height: 1;
  margin: 0;
  outline: none;
  padding: 3px 0;
  padding: 6px 10px;
  pointer-events: none;
  width: 100%;
}

#select-wrapper.open input {
  border-bottom: 0px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

#select-wrapper .icon {
  font-size: 14px;
  left: 4px;
  line-height: 1;
  position: absolute;
}

#select-options .item {
  background-color: var(--main-box-bg-color-op);
  border-radius: 8px;
  color: var(--main-text-color);
  cursor: pointer;
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  margin: 0px 6px;
  overflow: hidden;
  padding: 8px 10px;
  text-overflow: ellipsis;
  text-transform: uppercase;
}

#select-options .scroll-area {
  padding: 10px 0;
}

#select-options .item:first-letter {
  text-transform: uppercase;
}

#select-options .item:hover {
  background-color: var(--main-hover-color);
}

#select-options .item:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

#select-wrapper.open input {
  border-bottom: 1px solid var(--main-text-color);
}

#select-wrapper.open #input-title {
  color: var(--main-accent-color);
}

#input-error-message,
#input-helper-message {
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding: 5px 0 0 10px;
  position: relative;
}

#input-error-message {
  color: var(--main-color-error);
}

#input-helper-message {
  color: var(--main-secondary-text-color);
}

.input-wrapper #input-title.error {
  color: var(--main-color-error);
}

#empty {
  padding: 10px;
  color: var(--main-text-color);
  font-size: var(--main-font-size);
}

</style>
