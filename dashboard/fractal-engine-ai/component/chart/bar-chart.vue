<template>
  <Bar
    :data="chartData"
    :options="chartOptions"/>
</template>

<script setup>
// TODO: UPDATE ALL CHART COMPONENTS LIKE THIS
import {
  getCurrentInstance,
  onMounted,
  ref,
} from 'vue'

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const INSTANCE = getCurrentInstance()
const GLOBAL = INSTANCE.appContext.config.globalProperties

const PROPS = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => {}
  }
})

let chartData = ref(PROPS.chartData)
let chartOptions = ref(PROPS.chartOptions)


onMounted (async () => {
  setup()
})

const setup = () => {
  setupListeners()
  setDefaultChartOptions()
}

const setupListeners = () => {
  GLOBAL.$emitter.on('dashboard-change-theme', () => {
    setDefaultChartOptions()
  })
}

const setDefaultChartOptions = () => {
  chartOptions.value = {
    responsive: chartOptions.value.responsive,
    maintainAspectRatio: chartOptions.value.maintainAspectRatio,
    scales: {
      x: {
        ticks: {
          color:  GLOBAL.$getCSSVarValue('--main-text-color'),
        }
      },
      y: {
        ticks: {
          color:  GLOBAL.$getCSSVarValue('--main-text-color'),
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color:  GLOBAL.$getCSSVarValue('--main-text-color'),
        }
      }
    },
  }
}

</script>