<template lang="html">
  <div id="placeholder">
    <img :src="placeHolder[PROPS.type]"/>
  </div>
</template>

<script setup>
import {
  getCurrentInstance,
  onMounted,
} from 'vue'

const INSTANCE = getCurrentInstance()
const GLOBAL = INSTANCE.appContext.config.globalProperties


const PROPS = defineProps({
  type: {
    type: String,
    default: '',
  },
})

const placeHolder = {
  chart: `${ GLOBAL.$config.app_static_path }/assets/placeholder-chart.png`,
  file: `${ GLOBAL.$config.app_static_path }/assets/placeholder-file.png`,
  list: `${ GLOBAL.$config.app_static_path }/assets/placeholder-list.png`,
  table: `${ GLOBAL.$config.app_static_path }/assets/placeholder-table.png`,
  scatter: `${ GLOBAL.$config.app_static_path }/assets/placeholder-scatter.png`,
}

onMounted (async () => {

})

</script>

<style lang="css" scoped>

#placeholder {
  align-items: center;
  display: flex;
  justify-content: center;
}

#placeholder img {
  height: 100%;
  max-width: 100%;
  object-fit: contain;
}

</style>