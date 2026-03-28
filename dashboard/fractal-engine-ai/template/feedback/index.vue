<template lang="html">
  <div>
    <Widget
      sectionTitle="primary information"
      sectionDescription="basic data"
      v-bind:isLoading="isLoading"
      width="100%">
      <Grid v-if="!isNew">
        <template #slota>
          <div class="data">
            <label>
              {{ $t('id') }}
            </label>
            <p>
              {{ model.get('id') }}
            </p>
          </div>
          <div class="data">
            <label>
              {{ $t('category') }}
            </label>
            <p>
              {{ model.get('category_id_ref') }}
            </p>
          </div>
          <div class="data">
            <label>
              {{ $t('user') }}
            </label>
            <p>
              {{ model.get('user_id_ref') }}
            </p>
          </div>
        </template>
        <template #slotb>
          <div class="data">
            <label>
              {{ $t('title') }}
            </label>
            <p>
              {{ model.get('feedback_title') }}
            </p>
          </div>
          <div class="data">
            <label>
              {{ $t('description') }}
            </label>
            <p>
              {{ model.get('feedback_description') }}
            </p>
          </div>
          <div class="data">
            <label>
              {{ $t('date') }}
            </label>
            <p>
              {{ model.get('created_at') }}
            </p>
          </div>
        </template>
      </Grid>
    </Widget>
    <FloatButtonOptions
      openIcon="add"
      closeIcon="close"
      v-bind:options="floatOptions"
      v-bind:expanded="true"/>
  </div>
</template>

<script>
import {
  useRouter,
  useRoute
} from 'vue-router'

import Grid from '../../component/grid.vue'
import Widget from '../../component/widget.vue'
import FloatButtonOptions from '../../component/float-button-options.vue'

export default {
  data () {
    return {
      router: useRouter(),
      route: useRoute(),
      isNew: true,
      feedback: new this.$model.FeedbackMC.model(),
      isLoading: false,
    }
  },
  components: {
    Grid,
    Widget,
    FloatButtonOptions,
  },
  created () {
    let routeParamId = this.route.params.id
    if (routeParamId !== undefined && routeParamId.toString().length) {
      this.isNew = false
      this.model.set('id', routeParamId)
      this.getModelData()
      return
    }
  },
  methods: {
    async getModelData () {
      this.isLoading = true
      try {
        await this.model.fetch()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped lang="css">

.data {
  display: grid;
  text-transform: uppercase;
  margin: 12px 0;
  justify-content: center;
  grid-template-columns: 1fr 1fr;
}

.data > label {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  left: 6px;
  padding: 0 4px;
  pointer-events: none;
  text-align: right;
}

.data > p {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  left: 6px;
  padding: 0 4px;
  pointer-events: none;
  margin: 0;
  text-align: left;
}


</style>
