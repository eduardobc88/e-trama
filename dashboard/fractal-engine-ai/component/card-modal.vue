<template lang="html">
  <div class="modal-box-wrapper">
    <div class="box-content">
      <SectionHeader
        v-if="modalTitle"
        v-bind:sectionIcon="'info'"
        v-bind:sectionTitle="modalTitle"
        v-bind:sectionDescription="modalDescription"
        v-bind:highlight="true"
        v-bind:expanded="true"
        v-bind:isLoading="false"/>
      <perfect-scrollbar class="scroll-area">
        <div id="content">
          <div id="info">
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
            <hr />
            <Table
              title="autoridades"
              description="listado de autoridades"
              v-bind:tableHeaderItems="['nombre', 'posición']"
              v-bind:tableItemProps="['name', 'position']"
              v-bind:items="card.get('town_authority_list_json')"/>
            <hr />
            <Table
              title="posibles candidatos"
              description="listado de posibles candidatos"
              v-bind:tableHeaderItems="['nombre', 'posición']"
              v-bind:tableItemProps="['name', 'position']"
              v-bind:items="card.get('possible_candidate_list_json')"/>
            <hr />
            <Table
              title="actores políticos"
              description="listado de actores políticos"
              v-bind:tableHeaderItems="['nombre', 'posición', 'abr']"
              v-bind:tableItemProps="['name', 'position', 'abr']"
              v-bind:items="card.get('town_actor_list_json')"/>
            <hr />
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
            <hr />
            <Table
              title="consejo"
              description="listado de consejeros"
              v-bind:tableHeaderItems="['nombre', 'posición', 'abr']"
              v-bind:tableItemProps="['name', 'position', 'abr']"
              v-bind:items="card.get('advice_list_json')"/>
            <hr />
            <Table
              title="numeralia"
              description="listado de numeralia"
              v-bind:tableHeaderItems="['cot', 'promovidos', 'comites', 'miembros']"
              v-bind:tableItemProps="['cot', 'total_promoted', 'total_committees', 'total_committes_members']"
              v-bind:items="card.get('numerals_list_json')"/>
          </div>
        </div>
      </perfect-scrollbar>
      <div class="buttons-wrapper">
        <Button
          buttonIcon="done"
          v-bind:buttonAction="onAccept"
          style="margin-left: 5px;">
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

hr {
  border: 0;
  margin: 40px 0 5px 0;
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
  max-height: 420px;
  max-width: 768px;
  padding: 10px;
  position: relative;
  width: calc(100% - 12px);
}

.title {
  color: var(--main-accent-color);
  font-size: calc(var(--main-accent-font-size) + 4px);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0 0 10px 0;
  text-transform: uppercase;
}

.description {
  color: var(--main-secondary-text-color);
  font-size: calc(var(--main-accent-font-size) + 4px);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0 0 10px 0;
  text-transform: uppercase;
}

.box-content #content {
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0px;
  max-height: 260px;
  text-transform: uppercase;
}

.scroll-area {
  margin: 0 0 10px 0;
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
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding: 0 4px;
  text-transform: uppercase;
  margin: 0;
}

</style>