<template>
  <div>
    <SectionHeader
      v-if="title"
      v-bind:sectionTitle="title"
      v-bind:sectionDescription="description"
      customPaddingStyle="0 6px"
      customMarginStyle="6px 0"
      v-bind:highlight="false"/>
    <div id="table">
      <div
        id="table-header"
        v-bind:style="{
          'grid-template-columns': `repeat(${ tableHeaderItems.length }, 1fr)`,
        }">
        <template v-for="(i, k) of tableHeaderItems">
          <div>
            <p>
              {{ i }}
            </p>
          </div>
        </template>
      </div>
      <div id="table-body">
        <template v-for="(i, ik) of items">
          <div
            v-bind:style="{
              'grid-template-columns': `repeat(${ tableHeaderItems.length }, 1fr)`,
            }">
            <template v-for="(p, pk) of tableItemProps">
              <div>
                <p>
                  {{ i[p] }}
                </p>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SectionHeader from './section-header.vue'

export default {
  props: [
    'title',
    'description',
    'tableHeaderItems',
    'tableItemProps',
    'items',
  ],
  data () {
    return {
      collection: new this.$model.ModelMC.collection(),
    }
  },
  components: {
    SectionHeader,
  },
  created () {

  },
  methods: {

  },
}
</script>

<style scoped lang="css">

#table {

}

#table-header {
  display: grid;
  column-gap: 6px;
  padding: 10px;
  border-radius: 10px;
}

#table-header div > p {
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  text-transform: uppercase;
  color: var(--main-text-color);
  margin: 0;
  padding: 0 6px;
  position: relative;
}

#table-body > div {
  display: grid;
  column-gap: 6px;
  padding: 10px;
  border-radius: 10px;
}

#table-body > div div > p {
  font-size: var(--main-font-size);
  font-weight: 600;
  text-transform: uppercase;
  color: var(--main-text-color);
  margin: 0;
  padding: 0 6px;
  position: relative;
}

#table-body > div:nth-child(odd) {
  background-color: var(--main-table-bg-row);
}

</style>
