<template>
  <div>
    <SectionHeader
      v-if="title"
      v-bind:sectionTitle="title"
      v-bind:sectionDescription="description"
      customPaddingStyle="0 6px"
      customMarginStyle="6px 0"
      v-bind:highlight="false"/>
    <div id="table-form">
      <div class="table-header">
        <div
          class="table-row"
          v-bind:style="{
            'grid-template-columns': `repeat(${ Object.keys(props).length + 1 }, 1fr)`,
          }">
          <template
            v-for="(val, key) of props">
            <div class="table-col">
              <p>
                {{ $t(key.replaceAll('_', ' ')) }}
              </p>
            </div>
          </template>
          <div class="table-col">
            <ButtonIcon
              class="table-button"
              buttonIcon="add"
              v-bind:buttonAction="addTableRow"/>
          </div>
        </div>
      </div>
      <div class="table-body">
        <template
          v-for="(item, iIndex) of collection.getModels()">
          <div
            class="table-row"
            v-bind:style="{
              'grid-template-columns': `repeat(${ Object.keys(props).length + 1 }, 1fr)`,
            }">
            <template
              v-for="(val, key) of props">
              <div
                class="table-col">
                <InputText
                  v-bind:isEmbeded="true"
                  inputName=""
                  v-bind:inputValue="item.get(key)"
                  v-bind:onChangeValue="onChangeInputListValue"
                  v-bind:data="item"
                  v-bind:propName="key"/>
              </div>
            </template>
            <div class="table-col">
              <ButtonIcon
                class="table-button"
                buttonIcon="delete"
                v-bind:buttonData="item"
                v-bind:buttonAction="removeTableRow"/>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonIcon from './button-icon.vue'
import InputText from './input-text.vue'
import SectionHeader from './section-header.vue'

export default {
  props: [
    'title',
    'description',
    'model',
    'props',
    'property',
  ],
  data () {
    return {
      collection: new this.$model.ModelMC.collection(),
    }
  },
  components: {
    ButtonIcon,
    InputText,
    SectionHeader,
  },
  created () {
    this.model.on('sync, notification', data => {
      this.collection = new this.$model.ModelMC.collection()
      let valueArr = this.model.get(this.property)
      for (let i of valueArr) {
        let model = new this.$model.ModelMC.model()
        model.set(i)
        this.collection.add(model)
      }
    })
  },
  methods: {
    addTableRow () {
      let model = new this.$model.ModelMC.model()
      model.set(this.props)
      this.collection.add(model)
      this.updateModel()
    },
    removeTableRow (model) {
      this.collection.remove(model)
      this.updateModel()
    },
    onChangeInputListValue (propName, value, model) {
      model.set(propName, value)
      this.updateModel()
    },
    updateModel () {
      let values = []
      for (let m of this.collection.getModels())
        values.push(m._attributes)
      this.model.set(this.property, values)
    },
  },
}
</script>

<style scoped lang="css">

#table-form {
  display: flex;
  flex-direction: column;
}

.table-header .table-col > p {
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  text-transform: uppercase;
  color: var(--main-text-color);
  margin: 0;
  padding: 0 4px;
  position: relative;
  left: 5px;
}

.table-body {
  gap: 6px;
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  gap: 6px;
}

.table-col {
  display: flex;
  align-content: center;
  align-items: center;
}

.table-col > div {
  align-self: center;
}

</style>