<template lang="html">
  <div id="wrapper">
    <div
      id="input-wrapper"
      v-bind:class="{
        embeded: rowEmbeded,
        error: errorMessage,
        focus: hasFocus,
        'no-empty': hasText,
      }">
      <label
        id="input-title"
        v-bind:class="{ 'error': errorMessage }">
        {{ $t(inputName) }}
      </label>
      <input
        type="text"
        v-on:focus="focus"
        v-on:blur="focus"
        v-model="value"
        v-on:click="toggleDatePicker"
        readonly/>
      <label
        v-show="errorMessage"
        id="input-error-message">
        {{ $t(errorMessage) }}
      </label>
      <label
        v-show="!errorMessage"
        id="input-helper-message">
        {{ $t(helperMessage) }}
      </label>
    </div>
    <transition name="bounce">
      <div
        id="calendar"
        v-bind:class="{
          'top': isTop,
        }"
        v-if="isOpen">
        <div id="header">
          <div id="controller">
            <ButtonIcon
              buttonIcon="first_page"
              v-bind:buttonAction="previousYear"/>
            <ButtonIcon
              buttonIcon="navigate_before"
              v-bind:buttonAction="previousMonth"/>
            <p id="date-info">
              {{ getMonthName(currentMonth) }}
              <br/>
              {{ this.currentYear }}
            </p>
            <ButtonIcon
              buttonIcon="navigate_next"
              v-bind:buttonAction="nextMonth"/>
            <ButtonIcon
              buttonIcon="last_page"
              v-bind:buttonAction="nextYear"/>
          </div>
          <div id="days-labels">
            <div
              class="day-label"
              v-for="dayLabel in dayLabels">
              {{ dayLabel }}
            </div>
          </div>
        </div>
        <div id="body">
          <div
            class="day-number"
            v-for="monthDayNumber in totalCurrentMonthDays">
            <button
              v-if="monthDayNumber"
              v-bind:class="{
                'day-number-button': true,
                'current': isCurrentDate(monthDayNumber),
                'selected': monthDayNumber === selectedMonthNumberDay,
                'active': isActiveDate(monthDayNumber)
              }"
              v-on:click="onClickNumberMonth(monthDayNumber)">
              {{ monthDayNumber }}
            </button>
          </div>
        </div>
        <div id="footer">
          <Button
            buttonIcon="close"
            v-bind:buttonAction="onCancel"
            style="margin-left: 4px;">
            {{ $t('cancel') }}
          </Button>
          <Button
            buttonIcon="done"
            v-bind:buttonAction="onDone"
            style="margin-left: 4px;">
            {{ $t('accept') }}
          </Button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ButtonIcon from './button-icon.vue'
import Button from './button.vue'

export default {
  props: {
    doneAction: {
      type: Function,
      default: () => {},
    },
    data: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: ''
    },
    inputName: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    helperMessage: {
      type: String,
      default: '',
    },
    rowEmbeded: {
      type: Boolean,
      default: false,
    },
    isTop: {
      type: Boolean,
      default: false,
    },
    isTimestamp: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ButtonIcon,
    Button,
  },
  data () {
    return {
      currentValue: '',
      dayLabels: ['S', 'M', 'T', 'W', 'Th', 'F', 'S'],
      monthLabels: [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December',
      ],
      currentDate: '',
      activeDate: '',
      totalCurrentMonthDays: 0,
      countMonthDay: 0,
      currentYear: 2026,
      currentMonth: 1,
      currentDay: 1,
      currentMonthDays: [],
      selectedMonthNumberDay: -1,
      selectedDate: '',
      isOpen: false,
      formatDate: '',
      hasFocus: false,
      hasText: false,
    }
  },
  computed: {
    value: {
      set (newVal) {
        this.currentValue = newVal
        this.onChangeValue(this.propName, this.currentValue, this.data)
      },
      get () {
        let date = this.$getFormatDate(new Date(), this.formatDate)
        this.currentValue = ((this.currentValue === '')?date:this.currentValue)
        this.hasText = this.currentValue !== ''
        return this.$getFormatDate(new Date(this.currentValue), this.formatDate)
      },
    },
  },
  watch: {
    date (newVal, oldVal) {
      this.currentValue = this.date
      this.setDefaults()
      this.uuid = this.$uuid.v1()
    },
    isOpen (newVal, oldVal) {
      this.isOpen = newVal
      if (this.isOpen)
        this.setDefaults()
    },
  },
  created () {
    this.formatDate = 'YYYY-MM-DD'
    if (this.isTimestamp)
      this.formatDate = 'YYYY-MM-DD HH:mm:ss'
    if (this.date !== '') {
      this.currentValue = this.$getFormatDate(new Date(this.date), this.formatDate)
      this.setDefaults()
      this.uuid = this.$uuid.v1()
    }
    this.currentDate = this.$getFormatDate(new Date(), this.formatDate)
  },
  methods: {
    focus () {
      this.hasFocus = !this.hasFocus
      if (this.onFocus !== undefined)
        this.onFocus(this.hasFocus)
    },
    setDefaults () {
      let date = new Date()
      if (this.date && (this.date !== '0000-00-00 00:00:00' || this.date !== '0000-00-00') && this.date !== 'NULL' && this.date !== '')
        date = new Date(this.date)
      else
        date = new Date(this.currentDate)
      this.activeDate = this.$getFormatDate(date, this.formatDate)
      this.currentYear = parseInt(this.$getFormatDate(date, 'YYYY'))
      this.currentMonth = parseInt(this.$getFormatDate(date, 'MM'))
      this.currentDay = parseInt(this.$getFormatDate(date, 'DD'))
      this.generateMonthDays()
    },
    isActiveDate (monthDayNumber) {
      let date = `${ this.currentYear }-${ ('0' + this.currentMonth).slice(-2) }-${ ('0' + monthDayNumber).slice(-2) }`
      let dateFormated = this.$getFormatDate(new Date(date), 'YYYY-MM-DD')
      let activeDateFormated = this.$getFormatDate(new Date(this.activeDate), 'YYYY-MM-DD')
      if (activeDateFormated === dateFormated)
        return true

      return false
    },
    generateMonthDays () {
      let startNumberDayOfWeek = this.getFirstDayNumberWeekOfMonth(this.currentMonth, this.currentYear)
      let monthDays = this.getMonthTotalDays(this.currentMonth, this.currentYear)
      let numberDay = 1
      let monthNumberDays = []
      let totalMonthDays = monthDays + startNumberDayOfWeek
      for (let index = 0; index < totalMonthDays; index++)
        if (index >= startNumberDayOfWeek)
          monthNumberDays.push(numberDay++)
        else
          monthNumberDays.push(false)
      this.totalCurrentMonthDays = monthNumberDays
    },
    getMonthTotalDays (monthNumber, yearNumber) {
      return new Date(yearNumber, monthNumber, 0).getDate()
    },
    getFirstDayNumberWeekOfMonth (month, year) {
      let date = `${year}-${('0' + month).slice(-2)}-01`
      return new Date(date).getDay()
    },
    getMonthName (monthNumber) {
      let monthLabel = ''
      for (let index = 1; index <= this.monthLabels.length; index++)
        if (index == monthNumber) {
          monthLabel = this.monthLabels[index - 1]
          break
        }
      return monthLabel
    },
    previousYear () {
      this.currentYear = this.currentYear - 1
      this.selectedMonthNumberDay = -1
      this.generateMonthDays()
    },
    nextYear () {
      this.currentYear = this.currentYear + 1
      this.selectedMonthNumberDay = -1
      this.generateMonthDays()
    },
    previousMonth () {
      let monthNumber = this.currentMonth
      if (this.currentMonth - 1 < 1) {
        monthNumber = 12
        this.currentYear--
      } else
        monthNumber--
      this.selectedMonthNumberDay = -1
      this.currentMonth = monthNumber
      this.generateMonthDays()
    },
    nextMonth () {
      let monthNumber = this.currentMonth
      if (monthNumber + 1 > 12) {
        monthNumber = 1
        this.currentYear++
      } else
        monthNumber++
      this.selectedMonthNumberDay = -1
      this.currentMonth = monthNumber
      this.generateMonthDays()
    },
    isCurrentDate (monthDayNumber) {
      let date = `${ this.currentYear }-${ ('0' + this.currentMonth).slice(-2) }-${ ('0' + monthDayNumber).slice(-2) }`
      let dateFormated = this.$getFormatDate(new Date(date), 'YYYY-MM-DD')
      let currentDateFormated = this.$getFormatDate(new Date(this.currentDate), 'YYYY-MM-DD')
      if (currentDateFormated === dateFormated)
        return true

      return false
    },
    onClickNumberMonth (monthDayNumber) {
      let currentDate = new Date()
      let hours = currentDate.getHours()
      let minutes = currentDate.getMinutes()
      let seconds = currentDate.getSeconds()
      let date = `${ this.currentYear }-${ ('0' + this.currentMonth).slice(-2) }-${ ('0' + monthDayNumber).slice(-2) } ${ ('0' + hours).slice(-2) }:${ ('0' + minutes).slice(-2) }:${ ('0' + seconds).slice(-2) }`
      this.selectedDate = this.$getFormatDate(new Date(date), this.formatDate)
      this.selectedMonthNumberDay = monthDayNumber
    },
    onCancel () {
      this.isOpen = false
    },
    onDone () {
      this.isOpen = false
      if (this.selectedDate === '')
        return

      this.doneAction(this.selectedDate, this.data)
    },
    toggleDatePicker () {
      if (this.isOpen) {
        this.isOpen = false
        return
      }
      this.isOpen = true
    },
  },
}
</script>

<style scoped lang="css">
#wrapper {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  max-width: 480px;
  padding: 0;
  position: relative;
  width: 100%;
}

#input-wrapper {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  padding-top: 15px;
  position: relative;
  width: 100%;
}

#input-wrapper.embeded {
  height: auto;
  padding: 0;
}

#input-title {
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 700;
  left: 10px;
  padding: 0px;
  pointer-events: none;
  position: absolute;
  text-transform: uppercase;
  top: 25px;
  transition-duration: 100ms;
}

#input-wrapper input {
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid var(--main-border-color);
  box-sizing: border-box;
  caret-color: var(--main-accent-color);
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  margin: 0;
  outline: none;
  padding: 8px 10px;
  width: 100%;
}

#input-error-message,
#input-helper-message {
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding: 5px 0 0 10px;
  position: relative;
  text-transform: uppercase;
}

#input-title.error,
#input-error-message {
  color: var(--main-color-error);
}

#input-helper-message {
  color: var(--main-secondary-text-color);
}

#input-wrapper.error input {
  background-color: var(--main-input-error-bkg-color);
}

#input-wrapper.focus #input-title {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  top: -6px;
}

#input-wrapper.no-empty #input-title {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  padding: 0 20px;
  top: 6px;
}


#calendar {
  background-color: var(--main-box-bg-color-op);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  margin: -75px 0;
  padding: 10px;
  position: absolute;
  transition-duration: 100ms;
  width: 240px;
  z-index: 2;
}

#calendar.top {
  bottom: calc(100% - 280px);
}

#controller {
  display: grid;
  gap: 0px;
  grid-template-columns: 1fr 1fr 4fr 1fr 1fr;
  margin: 0 0 16px 0;
  text-align: center;
}

#header {
  position: relative;
}

#body,
#footer {
  display: flex;
  flex-wrap: wrap;
}

#body {
  height: 200px;
}

#footer {
  justify-content: flex-end;
  margin: 0;
}

#days-labels {
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

#date-info {
  align-self: center;
  color: var(--main-text-color);
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  padding: 0;
}

.day-label {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 600;
  height: 25px;
  position: relative;
  text-align: center;
  width: 34px;
}

.day-number {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  height: 34px;
  position: relative;
  text-align: center;
  width: 34px;
}

.day-number-button {
  background-color: var(--main-box-bg-color-op);
  border-radius: 10px;
  border: 0;
  cursor: pointer;
  height: 100%;
  outline: none;
  padding: 0;
  width: 100%;
  color: var(--main-text-color);
}

.day-number-button:hover {
  background-color: var(--main-hover-color);
}

.day-number-button:active {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
}

.day-number-button.current {
  color: var(--main-accent-color);
  font-weight: 600;
}

.day-number-button.selected {
  background-color: var(--main-active-color);
  color: var(--main-text-color);
  font-weight: 600;
}

.day-number-button.active {
  color: var(--main-text-color);
  font-weight: 600;
  border: 1px solid var(--main-accent-color);
}

.current-month-day {
  background-color: red;
}
</style>
