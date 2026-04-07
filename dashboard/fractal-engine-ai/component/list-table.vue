<template>
  <div>
    <div id="box">
      <div id="table-wrapper">
        <div
          id="table-header"
          v-bind:class="{
            dark: isFullContent,
          }">
          <div id="header">
            <div
              id="table-header-info"
              v-bind:class="{
                dark: isFullContent,
              }">
              {{ tableHeaderInfo }}<span v-if="tableHeaderInfo && tableHeaderFilteredInfo"> - </span>{{ tableHeaderFilteredInfo }}
            </div>
            <div>
              <Dropdown
                v-if="Object.keys(itemSelected).length && !hideActions"
                label="actions"
                v-bind:onSelectOption="onSelectOption"
                v-bind:selectOptions="selectOptions"/>
              <DropdownMultiSelect
                label="columns"
                v-bind:onSelectOption="onSelectColumnOptionChange"
                v-bind:selectOptions="selectColumnOptions"/>
            </div>
            <div id="search-wrapper">
              <InputText
                v-bind:isDark="isFullContent"
                inputName="filter"
                helperMessage="type something..."
                v-bind:inputValue="searchKeyWord"
                v-bind:onChangeValue="throttleSearchInRows"
                v-bind:isOverBody="isOverBody"/>
            </div>
          </div>
          <div class="table-tr">
            <div class="table-td">
              <Checkbox
                v-if="!hideActions"
                v-bind:isDark="isFullContent"
                v-bind:onChangeValue="onChangeValue"
                v-bind:currentValue="checkAll"
                data="all"/>
            </div>
            <div
              class="table-td"
              v-for="columnName, i in columnNames">
              <div class="column-name">
                <ButtonIcon
                  v-bind:isDark="isFullContent"
                  v-bind:buttonIcon="getIconName(i)"
                  v-bind:buttonAction="orderByColumn"
                  v-bind:buttonData="{
                    column_index: i,
                    column_name: columnName,
                  }"/>
                {{ $t(columnName) }}
              </div>
            </div>
            <div class="table-td"
              v-if="rowButtons !== undefined && rowButtons.length">
              {{ $t('actions') }}
            </div>
          </div>
        </div>
        <Widget
          v-bind:onlyWrapper="onlyWrapper"
          v-bind:isLoading="isLoading"
          v-bind:hideMinBtn="true"
          v-bind:fullWidth="true">
          <p
            id="empty"
            v-if="!collectionItems.length">
            {{ $t('empty') }}
          </p>
          <div
            v-bind:style="{
              height: ((maxHeight)?`${ maxHeight }px`:`100%`),
            }">
            <div
              v-if="collectionItems.length"
              id="table-body">
              <div
                class="table-tr"
                v-for="item in collectionItems"
                :key="item._uid">
                <div class="table-td">
                  <Checkbox
                    v-if="!hideActions"
                    v-bind:onChangeValue="onChangeValue"
                    v-bind:item="item"
                    v-bind:currentValue="!!item.getOption('is_checked')"
                    v-bind:letter="item.get(modelKey.letter)"
                    v-bind:imgPropName="keyThumbnail"/>
                </div>
                <div
                  class="table-td"
                  v-on:click="onClickRow(item)"
                  v-for="itemPropName in itemPropNames">
                  <p
                    v-if="itemPropName !== propColor"
                    class="item-text">
                    {{ getItemText(item, itemPropName, 0) }}
                  </p>
                  <p
                    v-if="rowChip !== null && rowChip.prop_name !== null && rowChip.prop_name !== undefined && rowChip.prop_name === itemPropName"
                    class="item-text-chip"
                    v-bind:style="item[rowChip.function_name]()">
                    {{ getItemText(item, rowChip.prop_name, 0) }}
                  </p>
                  <div
                    v-if="itemPropName === propColor && (rowChip !== null && rowChip.prop_name !== null && rowChip.prop_name === undefined && rowChip.prop_name !== itemPropName)"
                    class="tile-color"
                    v-bind:style="{
                      'background-color': item.get(itemPropName),
                    }">
                  </div>
                </div>
                <div
                  v-if="rowButtons !== undefined && rowButtons.length"
                  class="table-td">
                  <div class="buttons">
                    <ButtonIcon
                      v-for="b in rowButtons"
                      :key="$uuid.v1()"
                      v-bind:buttonIcon="b.icon"
                      v-bind:buttonAction="b.action"
                      v-bind:buttonData="{
                        name: b.name,
                        item: item,
                      }"/>
                  </div>
                </div>
                <template
                  v-if="item.getOption('buttonIcon') !== undefined && item.getOption('buttonIcon') !== null">
                  <div
                    class="table-td">
                    <div class="buttons">
                      <ButtonIcon
                        :key="$uuid.v1()"
                        v-bind:buttonIcon="item.getOption('buttonIcon').icon"
                        v-bind:buttonAction="item.getOption('buttonIcon').action"
                        v-bind:buttonData="{
                          item: item,
                        }"/>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </Widget>
      </div>
    </div>
  </div>
</template>

<script>

// columnNames: [
//   'Name',
//   'Active',
// ],
// itemPropNames: [
//   'custom_entity_name',
//   'custom_entity_is_active',
// ],
// keyThumbnail: [
//   'user_avatar',
//   'file_name',
// ],
// rowButtons: [
//   icon: '',
//   action () {},
// ]
// rowChip: {
//   function_name: 'getStatusColor',
//   prop_name: 'status',
// }
import {
  useRouter,
  useRoute
} from 'vue-router'

import ButtonIcon from './button-icon.vue'
import Checkbox from './checkbox.vue'
import DropdownMultiSelect from './dropdown-multi-select.vue'
import Dropdown from './dropdown.vue'
import InputText from './input-text.vue'
import Widget from './widget.vue'

export default {
  components: {
    ButtonIcon,
    Checkbox,
    Dropdown,
    DropdownMultiSelect,
    File,
    InputText,
    Widget,
  },
  props: {
    collection: {
      type: Object,
      default: {},
    },
    onClickRow: {
      type: Function,
      default: () => {},
    },
    navigationBefore: {
      type: Function,
      default: () => {},
    },
    navigationNext: {
      type: Function,
      default: () => {},
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    itemsSkipped: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    keyThumbnail: {
      type: String,
      default: '',
    },
    rowButtons: {
      type: Array,
      default: [],
    },
    rowChip: {
      type: Object,
      default: {},
    },
    modelKey: {
      type: Object,
      default: {},
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    model: {
      type: Object,
      default: {},
    },
    modelPrefix: {
      type: String,
      default: '',
    },
    modelDefaultProps: {
      type: Array,
      default: [],
    },
    identifier: {
      type: String,
      default: '',
    },
    hideActions: {
      type: Boolean,
      default: false,
    },
    propColor: {
      type: String,
      default: '',
    },
    onlyWrapper: {
      type: Boolean,
      default: false,
    },
    isOverBody: {
      type: Boolean,
      default: false,
    },
    maxHeight: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      collectionItems: [],
      itemSelected: {},
      checkAll: false,
      tableHeaderInfo: '',
      tableHeaderFilteredInfo: '',
      orderByColumnName: '',
      orderType: '',
      searchKeyWord: '',
      throttleSearchInRows: this.$_.throttle(this.searchInRows, 200, { 'trailing': true }),
      isFullContent: false,
      selectColumnOptions: [],
      columnNames: [],
      itemPropNames: [],
      workbookKeys: [],
      workbookData: [{
        wb_name: 'items',
        wb_data: []
      }],
      inputModalData: {
        modalTitle: 'Title for file',
        modalDescription: 'You need to give a name for the file',
        inputName: 'File name',
        helperMessage: 'Insert a name without extension',
        modalAccept: this.exportToFile,
        modalCancel: this.closeInputModal,
      },
      selectOptions: [
        {
          name: 'delete',
          value: 'delete',
        },
        {
          name: 'XLSX',
          value: 'xlsx',
        },
        ],
    }
  },
  watch: {
    'collection' (newValues, oldValues) {
      this.collectionItems = newValues.getModels()
    },
    'modelDefaultProps' (newValues, oldValues) {
      this.generateOptions()
    },
  },
  created () {
    this.route.name
    this.workbookData[0].wb_name = this.headerTitle
    this.collectionItems = this.collection.getModels()
    this.$emitter.on('clear-items-selected', () => {
      this.checkAll = false
    })
    this.collection.on('fetch, sync', event => {
      this.collectionItems = this.collection.getModels()
    })
    this.generateOptions()
  },
  methods: {
    generateOptions () {
      this.selectColumnOptions = this.$getModelColumns(this.model, this.modelPrefix, this.modelDefaultProps)
      this.generateViewColumns()
    },
    setTableHeaderInfo () {
      let tableInfo = ''
      if (!!Object.keys(this.itemSelected).length)
        tableInfo = `${ Object.keys(this.itemSelected).length } ${ this.$t('records of') } ${ this.collectionItems.length } ${ this.$t('selected') }`
      this.tableHeaderInfo = tableInfo
    },
    onChangeValue (_, isChecked, item, data) {
      if (data === 'all') {
        let itemsChecked = {}
        this.checkAll = !this.checkAll
        for (let item of this.collectionItems) {
          item.setOption('is_checked', this.checkAll)
          if (this.checkAll) {
            let propName = item.getOption('identifier')
            let id = item.get(propName)
            itemsChecked[id] = id
          }
        }
        this.itemSelected = itemsChecked
        this.$emitter.emit('items-selected', this.itemSelected)
        this.setTableHeaderInfo()
        return
      }
      this.checkAll = false
      item.setOption('is_checked', isChecked)
      let propName = item.getOption('identifier')
      let id = item.get(propName)
      if (isChecked)
        this.itemSelected[id] = id
      else
        delete this.itemSelected[id]
      this.$emitter.emit('items-selected', this.itemSelected)
      this.setTableHeaderInfo()
    },
    getItemText (item, itemPropName, index) {
      if (Array.isArray(itemPropName))
        return this.getItemText(item[itemPropName[index]], itemPropName[index + 1], index + 1)

      let keys = itemPropName.split(':')
      if (keys.length > 1) {
        let key = keys[0]
        let type = keys[1]
        if (type === 'date')
          return this.$getFormatDate(new Date(item[key]), 'YYYY-MM-DD HH-mm-ss')
      }
      return item.get(keys[0])
    },
    getItemId (item) {
      let propIdName = item.getOption('identifier')
      return item.get(propIdName)
    },
    getIconName (columnIndex) {
      if (this.orderByColumnName === '')
        return 'sort_by_alpha'

      let propName = this.itemPropNames[columnIndex]
      if (this.orderByColumnName !== propName)
        return 'sort_by_alpha'

      if (this.orderType === 'desc')
        return 'expand_more'

      return 'expand_less'
    },
    orderByColumn (data) {
      let propName = this.itemPropNames[data.column_index]
      if (this.orderByColumnName !== propName || this.orderType === '')
        this.orderType = 'desc'
      else if (this.orderType === 'desc')
        this.orderType = 'asc'
      else
        this.orderType = 'desc'
      this.orderByColumnName = propName
      let collectionItemsResult = []
      if (this.searchKeyWord !== '')
        collectionItemsResult = this.getCollectionFiltered(this.searchKeyWord)
      else
        collectionItemsResult = this.collection.getModels()
      let propType = this.model._mutations[this.orderByColumnName]
      if (propType !== undefined && propType.name === 'Number')
        this.collectionItems = _.orderBy(collectionItemsResult, m => {
          return Number(m.get(this.orderByColumnName))
        }, this.orderType)
      else
        this.collectionItems = _.orderBy(collectionItemsResult, this.orderByColumnName, this.orderType)
      this.setTableHeaderInfo()
    },
    searchInRows (i, keyword) {
      this.searchKeyWord = keyword.trim()
      this.collectionItems = this.getCollectionFiltered(keyword)
      this.cleanUpSelectedItems()
    },
    getCollectionFiltered (keyword) {
      let keyWordLowerCase = keyword.toLowerCase()
      let collectionFiltered = this.collection.filter(item => {
        let match = false
        for (var propName of this.itemPropNames) {
          let value = item.get(propName)
          if (value.toString().length && value.toString().toLowerCase().includes(keyWordLowerCase)) {
            match = true
            break
          }
        }
        return match
      })
      return collectionFiltered.getModels()
    },
    cleanUpSelectedItems () {
      let newItemsSelected = {}
      for (var itemModel of this.collectionItems) {
        let propName = itemModel.getOption('identifier')
        let itemModelId = itemModel.get(propName)
        let isChecked = false
        for (var itemSelectedId of Object.keys(this.itemSelected)) {
          if (itemModelId.toString() === itemSelectedId) {
            isChecked = true
            break
          }
        }
        itemModel.setOption('is_checked', isChecked)
        if (isChecked)
          newItemsSelected[itemModelId] = itemModelId
      }
      this.orderByColumnName = ''
      this.orderType = ''
      this.checkAll = false
      this.itemSelected = newItemsSelected
      this.$emitter.emit('items-selected', this.itemSelected)
      this.setTableHeaderInfo()
    },
    onSelectColumnOptionChange (propName) {
      for (let column of this.selectColumnOptions)
        if (column.item_prop === propName) {
          column.item_value = !column.item_value
          break
        }
      this.generateViewColumns()
    },
    generateViewColumns () {
      let workbookKeys = []
      let columnNames = []
      let itemPropNames = []
      for (let column of this.selectColumnOptions) {
        if (column.item_value) {
          columnNames.push(column.item_name)
          itemPropNames.push(column.item_prop)
          workbookKeys.push({
            column_name: column.item_name,
            prop_name: column.item_prop,
          })
        }
      }
      this.columnNames = columnNames
      this.itemPropNames = itemPropNames
      this.workbookKeys = workbookKeys
    },
    exportToFile (fileName) {
      let wbData = []
      for (let item of this.collectionItems) {
        let obj = {}
        for (let wbKey of this.workbookKeys)
          obj[wbKey.column_name] = item.get(wbKey.prop_name)
        wbData.push(obj)
      }
      this.workbookData[0].wb_data = wbData
      this.$exportTo.xlsx(fileName, this.workbookData)
      this.closeInputModal()
    },
    closeInputModal () {
      this.$emitter.emit('input-modal', null)
    },
    async onSelectOption (option) {
      switch (option) {
        case 'xlsx':
          this.$emitter.emit('input-modal', this.inputModalData)
          break
        case 'delete':
          try {
            let promisses = []
            let typeAction = ''
            this.$emitter.emit('is-loading', true)
            if (option === 'delete') {
              typeAction = 'deleted'
              Object.values(this.itemSelected).forEach(id => {
                let item = this.collection.find(item => {
                  let itemId = item.get(this.identifier)
                  if (itemId === id)
                    return true

                  return false
                })
                promisses.push(item.delete())
              })
            }
            await Promise.all(promisses)
          } catch (err) {
            console.error(err)
          } finally {
            this.itemSelected = {}
            this.$emitter.emit('is-loading', false)
          }
          break
      }
    },
  },
}
</script>

<style scoped lang="css">
#table-wrapper {
  color: var(--main-text-color);
}

.item-text {
  align-self: center;
  margin: 0;
  padding: 0;
}

.item-text-chip {
  align-self: center;
  border-radius: 10px;
  display: flex;
  font-weight: 600;
  justify-content: center;
  margin: 0;
  max-width: 200px;
  overflow: auto;
  padding: 4px 8px;
  text-align: center;
  text-overflow: ellipsis;
  text-transform: uppercase;
}

.buttons {
  display: inline-flex;
  grid-gap: 5px;
}

.column-name {
  align-items: center;
  display: flex;
  gap: 4px;
}

#header {
  display: grid;
  gap: 6px;
  grid-template-columns: auto 330px 200px;
  margin: 0 10px;
  position: relative;
  z-index: 3;
}

#header > div:nth-child(2) {
  display: flex;
  gap: 6px;
  justify-content: right;
}

#table-header-info {
  align-self: center;
  color: var(--main-accent-color);
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  position: inherit;
  text-align: center;
  text-transform: uppercase;
}

#search-wrapper {
  align-self: center;
  margin: 0 0 0 6px;
}

.table-tr {
  display: grid;
  gap: 10px;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  grid-template-columns: 30px 50px;
  margin: 0;
}

.table-td {
  align-self: center;
  display: grid;
  position: relative;
}

#table-header .table-td:after {
  align-self: center;
  border-right: 2px solid var(--main-accent-color);
  content: "";
  height: 8px;
  pointer-events: none;
  position: absolute;
  right: -4px;
  width: 100%;
}

#table-header .table-td:first-child:after {
  border-right: 0px;
}

#table-header .table-td:last-child:after {
  border-right: 0px;
}


#table-header {
  background-color: var(--main-body-bg-color);
  margin: 0;
  position: sticky;
  top: 0;
  transition: background-color 1s ease;
  z-index: 2;
}

#table-header .table-tr {
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  margin: 0 10px;
  padding: 5px 10px 0 10px;
  position: relative;
  text-transform: uppercase;
  transition-duration: 100ms;
  z-index: 1;
}

#table-body .table-td {
  font-size: var(--main-font-size);
  min-height: 40px;
}

#table-body .table-tr {
  border-radius: 10px;
  cursor: pointer;
  padding: 0 10px;
  position: relative;
}

#table-body .table-tr:after {
  border-bottom: 2px solid var(--main-table-bg-row);
  content: "";
  height: 6px;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  width: calc(100% - 15%);
  bottom: -1px;
}

#table-body .table-tr:last-child:after {
  border: 0;
}

/*#table-body .table-tr:nth-child(even) {
  background-color: var(--main-table-bg-row);
}*/

#table-body .table-tr:hover {
  background-color: var(--main-hover-color);
}

#table-body .table-tr:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

#empty {
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}

.tile-color {
  align-self: center;
  border-radius: 5px;
  height: 16px;
  width: 16px;
}
</style>
