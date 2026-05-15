<template lang="html">
  <Scatter :data="data" :options="options"/>
</template>

<script setup>

// NOTE: https://vue-chartjs.org/examples/
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Scatter } from 'vue-chartjs'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)


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