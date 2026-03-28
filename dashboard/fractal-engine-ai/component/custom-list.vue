<template lang="html">
  <div id="custom-fields">
    <label id="title">
      {{ $t(title) }}
    </label>
    <div id="new-field">
      <InputText
        class="input"
        inputName="value"
        v-bind:inputValue="newFieldValue"
        v-bind:onChangeValue="onChangeInputValue"
        propName="new_value"
        v-bind:helperMessage="helperMessage"
        v-bind:onKeyupEnter="onKeyupEnter"
        ref="start"/>
      <ButtonIcon
        class="remove"
        buttonIcon="cancel"
        v-bind:buttonAction="clearNewCustomField"/>
    </div>
    <div id="overflow">
      <perfect-scrollbar>
        <template
          v-for="(item, index) in items">
          <div
          class="item"
          style="display: flex;"
          v-if="!item.deleted">
          <SimpleInputText
            class="input"
            v-bind:inputValue="item[valueName]"
            v-bind:onChangeValue="onChangeCustomField"
            v-bind:data="index"/>
          <ButtonIcon
            class="remove"
            buttonIcon="cancel"
            v-bind:buttonAction="onRemoveCustomField"
            v-bind:buttonData="index"/>
        </div>
        </template>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import SimpleInputText from './simple-input-text.vue'
import InputText from './input-text.vue'
import ButtonIcon from './button-icon.vue'

export default {
  props: [
    'title',
    'model',
    'itemsPropName',
    'helperMessage',
    'uniqueValues',
    'valueName',
    'markAsDeleted',
  ],
  data () {
    return {
      items: [],
      newFieldValue: '',
    }
  },
  components: {
    SimpleInputText,
    InputText,
    ButtonIcon,
  },
  created () {
    this.model.on('change', this.setup)
  },
  methods: {
    setup () {
      this.items = this.model.get(this.itemsPropName)
    },
    onChangeInputValue (key, value) {
      this.newFieldValue = value
    },
    onKeyupEnter () {
      this.onAddCustomField(this.newFieldValue)
      this.newFieldValue = ''
      this.setFocus()
    },
    clearNewCustomField () {
      this.newFieldValue = ''
    },
    setFocus () {
      this.$refs.start['$el'].children[1].focus()
    },
    onAddCustomField (value) {
      if (!value.length || value === '')
        return

      if (this.uniqueValues)
        for (let i of this.items)
          if (i[this.valueName] === value)
            return

      let item = {}
      item[this.valueName] = value
      this.items.unshift(item)
      this.model.set(this.itemsPropName, this.items)
    },
    onChangeCustomField (index, oldValue, newValue) {
      this.items[index][this.valueName] = newValue
      this.model.set(this.itemsPropName, this.items)
    },
    onRemoveCustomField (index) {
      if (this.markAsDeleted) {
        this.items[index]['deleted'] = true
      } else {
        this.items.splice(index, 1)
        this.model.set(this.itemsPropName, this.items)
      }
    },
  },
}
</script>

<style scoped lang="css">
#custom-fields {
  max-width: 480px;
  margin-top: 20px;
}

#title {
  background-color: transparent;
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  pointer-events: none;
  text-transform: uppercase;
}

#overflow {
  display: flex;
  height: 300px;
  max-width: 100%;
}

.item {
  display: flex;
  min-width: 200px;
}

.item .input:first-child {
  margin-right: 5px;
}

.item .input:last-child {
  margin-left: 5px;
}

.input {
  flex-grow: 1;
}

#new-field {
  display: flex;
}

#new-field .input:first-child {
  margin-right: 5px;
}

#new-field .input:last-child {
  margin-left: 5px;
}

.remove {
  align-self: center;
  margin-left: 5px;
  max-height: 28px;
}
</style>
