<template lang="html">
  <div class="modal-box-wrapper">
    <div class="box-content">
      <div class="title">
        {{ $t(title) }}
      </div>
      <div id="bar">
        <FormDropdownSelect
          label="motivo de baja"
          helperMessage=""
          v-bind:currentValue="model.get('tipo_baja')"
          v-bind:selectOptions="model.getOptions('tipo_baja')"
          v-bind:onSelectOption="onSelectFormDropdownSelect"
          v-bind:initialIndexOption="model.getFormDropdownIndex('tipo_baja')"
          v-bind:errorMessage="model.errors.tipo_baja"
          propName="tipo_baja"/>
      </div>
      <div id="content">
        <template v-if="model.get('tipo_baja') !== ''">
          <DatePicker
            inputName="fecha de baja"
            v-bind:doneAction="onSelectDate"
            v-bind:date="model.get('fh_baja')"
            data="fh_baja"
            helperMessage=""
            v-bind:isTop="true"
            v-bind:isTimestamp="false"/>
          <DatePicker
            v-if="model.get('tipo_baja') === 'alta médica'"
            inputName="fecha de alta medica"
            v-bind:doneAction="onSelectDate"
            v-bind:date="model.get('fh_recuperacion')"
            data="fh_recuperacion"
            helperMessage=""
            v-bind:isTop="true"
            v-bind:isTimestamp="false"/>
          <DatePicker
            v-if="model.get('tipo_baja') === 'marcha'"
            inputName="fecha de acta de defunción"
            v-bind:doneAction="onSelectDate"
            v-bind:date="model.get('fh_defuncion')"
            data="fh_defuncion"
            helperMessage=""
            v-bind:isTop="true"
            v-bind:isTimestamp="false"/>
          <DatePicker
            v-if="model.get('tipo_baja') === 'cambio de domicilio'"
            inputName="fecha de cambio de domicilio"
            v-bind:doneAction="onSelectDate"
            v-bind:date="model.get('fh_cam_dom')"
            data="fh_cam_dom"
            helperMessage=""
            v-bind:isTop="true"
            v-bind:isTimestamp="false"/>
          <FormSearchDropdownSelect
            v-if="model.get('tipo_baja') === 'alta médica'"
            title="unidad médica"
            helpMsg=""
            v-bind:errorMsg="model.errors.hospital_baja"
            v-bind:collection="collection"
            v-bind:currentValue="model.get('hospital_baja')"
            v-bind:onSelectOption="onSelectFormSearchDropdownSelect"
            propName="hospital_baja"
            propNameToShow="search_show"
            v-bind:filterOverResults="true"/>
          <InputText
            v-bind:disabled="true"
            inputName="motivo de baja"
            v-bind:inputValue="model.motivo_baja"
            v-bind:onChangeValue="onChangeInputValue"
            propName="motivo_baja"
            v-bind:errorMessage="model.errors.motivo_baja"
            helperMessage=""
            maxLength="100"/>
          <InputTextarea
            inputName="obseraciones"
            v-bind:inputValue="model.observaciones"
            v-bind:onChangeValue="onChangeInputValue"
            propName="observaciones"
            v-bind:errorMessage="model.errors.observaciones"
            helperMessage=""
            maxLength="255"/>
        </template>
      </div>
      <div class="buttons-wrapper">
        <Button
          v-if="cancelAction"
          buttonIcon="clear"
          v-bind:buttonAction="cancelAction">
          {{ $t('cancel') }}
        </Button>
        <Button
          buttonIcon="done"
          v-bind:buttonAction="acceptAction"
          style="margin-left: 5px;">
          {{ $t('accept') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import FormSearchDropdownSelect from './form-search-dropdown-select.vue'
import Button from './button.vue'
import FormDropdownSelect from './form-dropdown-select.vue'
import DatePicker from './date-picker.vue'
import InputText from './input-text.vue'
import InputTextarea from './input-textarea.vue'

export default {
  props: [
    'model',
    'collection',
    'title',
    'description',
    'cancelAction',
    'acceptAction',
  ],
  components: {
    Button,
    FormDropdownSelect,
    DatePicker,
    InputText,
    InputTextarea,
    FormSearchDropdownSelect,
  },
  watch: {
    'model.tipo_baja' (newValue, oldValue) {
      this.setLowReason()
    },
    'model.fh_defuncion' (newValue, oldValue) {
      this.setLowReason()
    },
    'model.fh_recuperacion' (newValue, oldValue) {
      this.setLowReason()
    },
    'model.fh_cam_dom' (newValue, oldValue) {
      this.setLowReason()
    },
  },
  methods: {
    onChangeInputValue (propName, value) {
      this.model.set(propName, value)
    },
    onSelectFormDropdownSelect (option, index, propName) {
      let value = option.value
      if (option.value === null)
        value = ''
      this.model.set({
        tipo_baja: value,
        fh_baja: '',
        fh_defuncion: '',
        motivo_baja: '',
        observaciones: '',
        fh_recuperacion: '',
        hospital_baja: '',
        fh_cam_dom: '',
      })
    },
    setLowReason () {
      let lowReason = ''
      let lowType = this.model.get('tipo_baja')
      if (lowType === 'marcha') {
        let lowDate = this.model.get('fh_defuncion')
        lowReason = `BAJA POR DEFUNCIÓN SEGUN ACTA DE FECHA ${ lowDate }`
      } else if (lowType === 'alta médica') {
        let lowDate = this.model.get('fh_recuperacion')
        lowReason = `BAJA POR RECUPERACIÓN EN FECHA ${ lowDate }`
      } else if (lowType === 'cambio de domicilio') {
        let lowDate = this.model.get('fh_cam_dom')
        lowReason = `BAJA POR CAMBIO DE DOMICILIO CON FECHA ${ lowDate }`
      }
      this.model.set('motivo_baja', lowReason)
    },
    onSelectDate (date, propName) {
      this.model.set(propName, date._i)
    },
    onSelectFormSearchDropdownSelect (model, propName) {
      let value = model.get('search_show')
      this.model.set(propName, value)
    },
  },
}
</script>

<style scoped lang="css">

#bar {
  display: flex;
  justify-content: end;
}

.modal-box-wrapper {
  background: var(--main-notification-bkg);
  bottom: 0;
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 10;
}

.box-content {
  align-self: center;
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  margin: auto;
  max-width: 500px;
  padding: 10px;
  position: relative;
  width: calc(100% - 12px);
}

.title {
  color: var(--main-accent-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
}

.box-content #content {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  margin: 10px 0;
  text-transform: uppercase;
}

.buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 0px;
  right: 0;
}

.buttons-wrapper .button {
  background: transparent;
  border-radius: 10px;
  border: none;
  color: #000;
  color: #444;
  cursor: pointer;
  display: block;
  font-size: var(--main-font-size);
  font-weight: 600;
  outline: none;
  padding: 10px 15px;
  position: relative;
  right: 0;
  text-transform: uppercase;
}

.buttons-wrapper .button:last-child {
  color: var(--main-accent-color);
  margin-left: 10px;
}

.buttons-wrapper .button:hover {
  background-color: var(--main-hover-color);
}
</style>
