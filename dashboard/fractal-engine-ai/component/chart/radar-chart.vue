<template lang="html">
  <Radar :data="data" :options="options"/>
</template>

<script setup>

// NOTE: https://vue-chartjs.org/examples/
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'vue-chartjs'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)


// NOTE: COMPONENT PROPERTIES

const PROPS = defineProps({
  data: {
    type: Array,
    default: [],
  },
  options: {
    type: Object,
    default: {},
  },
})

</script>