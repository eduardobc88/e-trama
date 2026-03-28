<template lang="html">
  <div>
    <Grid>
      <template #slota>
        <Widget
          sectionTitle="primary information"
          sectionDescription="basic data"
          v-bind:isLoading="isLoading"
          width="100%"
          minHeight="auto"
          v-bind:hideMinBtn="true">
          a
        </Widget>
      </template>
      <template #slotb>
        <Widget
          sectionTitle="primary information"
          sectionDescription="basic data"
          v-bind:isLoading="isLoading"
          width="100%"
          minHeight="auto">
          b
        </Widget>
      </template>
      <template #slotc>
        <Widget
          sectionTitle="primary information"
          sectionDescription="basic data"
          v-bind:isLoading="isLoading"
          width="100%"
          minHeight="auto">
          c
        </Widget>
      </template>
      <template #slotd>
        <Widget
          sectionTitle="primary information"
          sectionDescription="basic data"
          v-bind:isLoading="isLoading"
          width="100%"
          minHeight="auto">
          d
        </Widget>
      </template>
    </Grid>
  </div>
</template>

<script>
import BoxWrapper from '../../component/box-wrapper.vue'
import Grid from '../../component/grid.vue'
import Widget from '../../component/widget.vue'

export default {
  data () {
    return {
      isLoading: true,
    }
  },
  components: {
    BoxWrapper,
    Grid,
    Widget,
  },
  computed: {

  },
  created () {
  },
  beforeDestroy () {
  },
  methods: {

  },
}
</script>

<style scoped lang="css">

</style>
<script setup lang="ts">
</script>
