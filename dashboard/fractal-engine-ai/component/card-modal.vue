<template>
  <div id="modal-box-wrapper">
    <div
      id="box-content"
      v-window-resize="onResizeWindow">
      <SectionHeader
        v-bind:sectionTitle="modalTitle"
        v-bind:sectionDescription="modalDescription"
        customPaddingStyle="0 6px"
        customMarginStyle="6px 0"
        v-bind:highlight="true"
        v-bind:expanded="true"/>
        <perfect-scrollbar
          class="scroll-area">
           <div
            id="content"
            v-bind:style="{
              height: `${ windowHeight }px`,
            }">
            <div class="key-value">
              <p class="key">
                nombre del enlace:
              </p>
              <p class="value">
                {{ card.get('link_name') }}
              </p>
            </div>
            <div class="key-value">
              <p class="key">
                distrito local:
              </p>
              <p class="value">
                {{ card.get('local_district') }}
              </p>
            </div>
            <div class="key-value">
              <p class="key">
                distrito federal:
              </p>
              <p class="value">
                {{ card.get('federal_district') }}
              </p>
            </div>
            <div class="key-value">
              <p class="key">
                teléfono:
              </p>
              <p class="value">
                {{ card.get('phone') }}
              </p>
            </div>
            <Table
              title="autoridades"
              description="listado de autoridades"
              v-bind:tableHeaderItems="['nombre', 'posición']"
              v-bind:tableItemProps="['name', 'position']"
              v-bind:items="card.get('town_authority_list_json')"/>
            <Table
              title="posibles candidatos"
              description="listado de posibles candidatos"
              v-bind:tableHeaderItems="['nombre', 'posición']"
              v-bind:tableItemProps="['name', 'position']"
              v-bind:items="card.get('possible_candidate_list_json')"/>
            <Table
              title="actores políticos"
              description="listado de actores políticos"
              v-bind:tableHeaderItems="['nombre', 'posición', 'abr']"
              v-bind:tableItemProps="['name', 'position', 'abr']"
              v-bind:items="card.get('town_actor_list_json')"/>
            <Table
              title="grupos"
              description="listado de grupos"
              v-bind:tableHeaderItems="['nombre', 'representante']"
              v-bind:tableItemProps="['name', 'representative']"
              v-bind:items="card.get('group_list_json')"/>
            <div class="key-value">
              <p class="key">
                descripción del grupo:
              </p>
              <p class="value">
                {{ card.get('group_description') }}
              </p>
            </div>
            <Table
              title="consejo"
              description="listado de consejeros"
              v-bind:tableHeaderItems="['nombre', 'posición', 'abr']"
              v-bind:tableItemProps="['name', 'position', 'abr']"
              v-bind:items="card.get('advice_list_json')"/>
            <Table
              title="numeralia"
              description="listado de numeralia"
              v-bind:tableHeaderItems="['cot', 'promovidos', 'comites', 'miembros']"
              v-bind:tableItemProps="['cot', 'total_promoted', 'total_committees', 'total_committes_members']"
              v-bind:items="card.get('numerals_list_json')"/>
          </div>
        </perfect-scrollbar>
        <div class="buttons-wrapper">
          <Button
            buttonIcon="done"
            v-bind:buttonAction="onAccept"
            style="margin-left: 4px;">
            {{ $t('accept') }}
          </Button>
        </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'
import SectionHeader from './section-header.vue'
import Table from './table.vue'
import Widget from './widget.vue'
import Grid from './grid.vue'

export default {
  props: [
    'modalTitle',
    'modalDescription',
    'modalAccept',
    'modalModel',
    'modalId',
    ],
  components: {
    Button,
    SectionHeader,
    Table,
    Grid,
    Widget,
  },
  data () {
    return {
      card: new this.$model.CardMC.model(),
      windowHeight: 0,
    }
  },
  created () {
    this.setup()
    this.onResizeWindow()
  },
  methods: {
    async setup () {
      try {
        this.card.set('id', this.modalId)
        await this.card.fetchByTown()
      } catch (err) {
        console.error(err)
      } finally {

      }
    },
    onAccept () {
      this.modalAccept()
    },
    onResizeWindow () {
      this.windowHeight = parseInt(window.innerHeight) - 220
    },
  },
}
</script>

<style scoped lang="css">

#modal-box-wrapper {
  background-color: var(--main-notification-bkg);
  bottom: 0;
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 5;
}

#box-content {
  align-self: center;
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  height: calc(100% - 128px);
  margin: auto;
  overflow: hidden;
  position: relative;
  transition-duration: 100ms;
  width: calc(100% - 128px);
}

#content {
  padding: 10px;
  height: 400px;
}

.buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  right: 0;
}

.key-value {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.key-value > .key {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding: 0 4px;
  text-transform: uppercase;
  margin: 0;
}

.key-value > .value {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding: 0 4px;
  text-transform: uppercase;
  margin: 0;
}

</style>
