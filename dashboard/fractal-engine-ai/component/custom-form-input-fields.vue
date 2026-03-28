<template>
  <div>
    <div id="title">
      {{ $t(title) }}
    </div>
    <div id="description">
      {{ $t(helperMessage) }}
    </div>
    <div id="table-form">
      <div class="table-header">
        <div
          class="table-row"
          v-bind:style="{
            'grid-template-columns': `repeat(${ Object.keys(props).length + 2 }, 1fr)`,
          }">
          <div class="table-col">
            <p>
              {{ $t('#') }}
            </p>
          </div>
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
          v-if="collection.getModels().length"
          v-for="(collectionModel, iIndex) of collection.getModels()">
          <div
            class="table-row"
            v-bind:style="{
              'grid-template-columns': `repeat(${ Object.keys(props).length + 2 }, 1fr)`,
            }">
            <div
              class="table-col">
              <p>
                {{ iIndex + 1 }}
              </p>
            </div>
            <template
              v-for="(val, key) of props">
              <div
                class="table-col">
                <InputText
                  v-if="val !== ''"
                  v-bind:isEmbeded="true"
                  inputName=""
                  v-bind:inputValue="collectionModel.get(key)"
                  v-bind:onChangeValue="onChangeInputText"
                  v-bind:data="collectionModel"
                  v-bind:propName="key"
                  v-bind:inputType="((val === 'number')?'number':'text')"
                  v-bind:disabled="((val === 'disabled')?true:false)"
                  v-bind:errorMessage="collectionModel.errors[key]"/>
                <label
                  v-if="val === ''"
                  class="simple-text">
                  {{
                    collectionModel.get(key)
                  }}
                </label>
              </div>
            </template>
            <div class="table-col">
              <ButtonIcon
                class="table-button"
                buttonIcon="delete"
                v-bind:buttonData="collectionModel"
                v-bind:buttonAction="removeTableRow"/>
            </div>
          </div>
        </template>
      </div>
      <label id="error-message">
        {{ $t(errorMessage) }}
      </label>
    </div>
  </div>
</template>

<script>
// EXAMPLE:
//
// <CustomFormInputFields
//   {title="utilitarios y servicios"
//   helperMessage="utilitarios y servicios necesario para el evento"}
//   v-bind:errorMessage="model.errors.assets"
//   propName="assets"
//   v-bind:props="{name: 'text', quantity: 'number', description: 'text', validation: ''}"
//   v-bind:validations="{name: 'required', quantity: 'required', description: '', validation: ''}"
//   v-bind:collection="model.get('assets')"
//   v-bind:model="model"
//   ref="assets"/>


import ButtonIcon from './button-icon.vue'
import InputText from './input-text.vue'

export default {
  props: [
    'title',
    'helperMessage',
    'errorMessage',
    'propName',
    'props',
    'validations',
    'model',
  ],
  components: {
    ButtonIcon,
    InputText,
  },
  data () {
    return {
      collection: new this.$model.ModelMC.collection(),
    }
  },
  created () {
    if (this.model.get(this.propName).length)
      this.initCollection()
  },
  methods: {
    initCollection () {
      let currentItems = this.model.get(this.propName)
      for (let item of currentItems) {
        let model = new this.$model.ModelMC.model()
        for (let key of Object.keys(item))
          model.addCustomProp(key, item[key])
        this.collection.add(model)
      }
    },
    addTableRow () {
      let model = new this.$model.ModelMC.model()
      this.addModelValidations(model)
      for (let key of Object.keys(this.props))
        if (this.props[key] === 'number')
          model.addCustomProp(key, 0)
        else
          model.addCustomProp(key, '')
      this.collection.add(model)
      this.refreshModelCollection()
    },
    removeTableRow (model) {
      this.collection.remove(model)
      this.refreshModelCollection()
    },
    onChangeInputText (propName, value, model) {
      model.set(propName, value)
      this.refreshModelCollection()
    },
    refreshModelCollection () {
      // TODO: IMPROVE THIS TO AVOID UPDATE EACH ELEMENT
      let items = []
      for (let model of this.collection.getModels())
        items.push(model._attributes)
      this.model.set(this.propName, items)
    },
    addModelValidations (model) {
      let validationFunctions = {}
      for (let key of Object.keys(this.validations))
        if (this.validations[key] === 'required')
          validationFunctions[key] = model.requiredValidation
      model.validation = () => {
        return validationFunctions
      }
    },
    async validate () {
      let validationPass = true
      for (let model of this.collection.getModels()) {
        let errors = await model.validate()
        if (!_.isEmpty(errors))
          validationPass = false
      }
      return validationPass
    }
  },
}
</script>

<style scoped lang="css">

#title {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding: 0 10px;
  pointer-events: none;
  text-transform: uppercase;
}

#description {
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding: 0 10px;
  pointer-events: none;
  text-transform: uppercase;
}

#table-form {
  display: flex;
  flex-direction: column;
}

.table-header .table-col > p,
.table-body .table-col > p {
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

#error-message {
  color: var(--main-color-error);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding-left: 10px;
  position: relative;
  text-transform: uppercase;
}

.simple-text {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  margin: 0;
  padding: 6px 10px;
  width: 100%;
}

</style>
