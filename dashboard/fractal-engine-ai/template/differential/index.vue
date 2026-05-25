<template lang="html">
  <div id="wrapper">
    <GoogleMap
      :GMTitle="GMTitle"
      :GMFeatures="googleMapFeatures"
      :GMFeatureOnClick="GMFeatureOnClick"
      :GMOnMarker="GMOnMarker"
      :GMOnRouteCalculated="GMOnRouteCalculated"/>
    <GridSpace
      gridTemplateColumns="1fr 2fr">
      <template #slota>
        <Widget
          v-bind:sectionTitle="((GMTitle == '')?'municipio':GMTitle)"
          sectionDescription="datos electorales"
          width="100%"
          minHeight="300px">
          <template v-if="townSelected !== null">
            <div id="coa-parties">
              <div class="item-definition">
                <div class="text">
                  <span>COALICIÓN A</span>
                </div>
              </div>
              <div id="politic-parties">
                <div
                  id="politic-parties-items">
                  <template
                    v-for="(party, keyParty) of plotPartiesA">
                    <div
                      class="button"
                      v-bind:class="{
                        active: party.active,
                      }"
                      v-on:click="onClickPoliticPlotParty(party)">
                      <img
                        v-bind:src="`${ GLOBAL.$config.app_static_path }/assets/icons/${ party.icon }`"/>
                    </div>
                  </template>
                </div>
              </div>
              <div class="item-definition">
                <div class="text">
                  <span>COALICIÓN B</span>
                </div>
              </div>
              <div id="politic-parties">
                <div
                  id="politic-parties-items">
                  <template
                    v-for="(party, keyParty) of plotPartiesB">
                    <div
                      class="button"
                      v-bind:class="{
                        active: party.active,
                      }"
                      v-on:click="onClickPoliticPlotParty(party)">
                      <img
                        v-bind:src="`${ GLOBAL.$config.app_static_path }/assets/icons/${ party.icon }`"/>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <template>
              status: {{  chartScatterStatus  }}
            </template>
          </template>
          <template v-else>
            <Placeholder type="list"/>
          </template>
        </Widget>
      </template>
      <template #slotb>
        <Widget
          sectionTitle="resultados por partido"
          sectionDescription="grafico de resultados por partido"
          width="100%"
          minHeight="300px">
          <template v-if="townSelected !== null">

          </template>
          <template v-else>
            <Placeholder type="chart"/>
          </template>
        </Widget>
      </template>
    </GridSpace>
  </div>
</template>

<script setup>
import {
  getCurrentInstance,
  onMounted,
  ref,
} from 'vue'

import BarChart from '../../component/chart/bar-chart.vue'
import GoogleMap from '../../component/google-map.vue'
import GridSpace from '../../component/grid-space.vue'
import Widget from '../../component/widget.vue'
import Placeholder from '../../component/placeholder.vue'


const INSTANCE = getCurrentInstance()
const GLOBAL = INSTANCE.appContext.config.globalProperties

let isLoading = ref(false)
let googleMapFeatures = ref([])
let townSelected = ref(null)
let GMTitle = ref('')
let resultCollection = new GLOBAL.$model.ResultMC.collection()
let colors = {
  pan: '#00579c',
  pri: '#28b154',
  prd: '#ffd203',
  pt: '#e8132e',
  pvem: '#9fce67',
  mc: '#ff7e00',
  morena: '#a53422',
  pan_pri_prd: '#4f8d62',
  pan_pri: '#148478',
  pan_prd: '#809450',
  pri_prd : '#94c22c',
  pt_morena: '#c62428',
  activo: '#00629f',
}
let parties = [
  {
    name: 'movimiento ciudadano',
    abr: 'mc',
    icon: 'mc.png',
    active: false,
  },
  {
    name: 'morena',
    abr: 'morena',
    icon: 'morena.png',
    active: false,
  },
  {
    name: 'partido acción nacional',
    abr: 'pan',
    icon: 'pan.png',
    active: false,
  },
  {
    name: 'partido revolucionario democratico',
    abr: 'prd',
    icon: 'prd.png',
    active: false,
  },
  {
    name: 'partido revolucionario institucional',
    abr: 'pri',
    icon: 'pri.png',
    active: false,
  },
  {
    name: 'partido del trabajo',
    abr: 'pt',
    icon: 'pt.png',
    active: false,
  },
  {
    name: 'partido verde',
    abr: 'pvem',
    icon: 'pv.png',
    active: false,
  },
]
let resultDefaultProps = [
  'id',
  'name',
  'total_votos',
  'votos_nulos',
  'votos_validos',
  'lista_nominal',
  'participacion_ciudadana',
  'pan',
  'pri',
  'prd',
  'pt',
  'pvem',
  'mc',
  'morena',
]
// NOTE: CHART
let chartAKey = ref('')
let chartData = ref({
  labels: [],
  datasets: [],
})
let chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
})

let chartScatterStatus = ref('')
let plotPartiesA = ref([])
let plotPartiesB = ref([])

// NOTE: REGRESION VARIABLES
let partyTownWinnerCollection = new GLOBAL.$model.ModelMC.collection()
let partyTownWinnerModel = new GLOBAL.$model.ModelMC.model()
let partyTownWinnerDefaultProps = []


onMounted (async () => {
  await setup()
})


const setup = async () => {
  try {
    isLoading.value = true
    resultCollection.set('state', 'michoacán')
    await resultCollection.fetch()
    setupMap()
    setupParties()
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const setupMap = () => {
  let features = []
  for (let i in GEOJSON_MUNICIPIO.features) {
    let feature = {}
    let iName = removeAccents(GEOJSON_MUNICIPIO.features[i].properties.nombre).toLowerCase()
    let models = resultCollection.filter(m => {
      let mName = removeAccents(m.get('name')).toLowerCase()
      return (mName === iName)
    })
    if (!models.getModels().length)
      continue

    let rModel = models.getModels()[0]
    let id = rModel.get('town_id')
    let rName = rModel.get('name')
    feature = GEOJSON_MUNICIPIO.features[i]
    feature.properties.data = {
      id: id,
      name: rName,
      coa_total: 0,
      single_total: 0,
      model: rModel,
      coa: '',
      party: '',
    }
    // NOTE: GET THE MAYOR FOR COA AND SINGLE PARTIES
    let coaTotalVotes = 0
    let coaKey = ''
    let singleTotalVotes = 0
    let singleKey = ''
    for (let p of parties) {
      for (let k of Object.keys(rModel.attributes)) {
        // NOTE: COA
        if (k.includes('_') && k.includes(p.abr) && parseInt(rModel.get(k)) > coaTotalVotes) {
          coaTotalVotes = parseInt(rModel.get(k))
          coaKey = k
        }
        // NOTE: SINGLE
        if (k === p.abr && parseInt(rModel.get(k)) > singleTotalVotes) {
          singleTotalVotes = parseInt(rModel.get(k))
          singleKey = k
        }
      }
    }
    // NOTE: CHECK IF IS PARTY AND SET DATA
    feature.properties.data.party = singleKey
    feature.properties.data.color = colors[singleKey]
    if (coaKey.includes(singleKey) && coaTotalVotes > singleTotalVotes) {
      feature.properties.data.coa = 'coa'
      feature.properties.data.party = coaKey.toString()
      feature.properties.data.color = colors[coaKey]
    }
    feature.properties.data.coa_total = coaTotalVotes
    feature.properties.data.single_total = singleTotalVotes
    features.push(feature)
  }
  googleMapFeatures.value = features
}

const removeAccents = str => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const GMFeatureOnClick = data => {
  townSelected.value = data.feature.nh
  GMTitle.value = townSelected.value.data.model.get('name')
  console.log('== GMFeatureOnClick ==:', townSelected.value)
}

const GMOnMarker = data => {
  console.log('== GMOnMarker ==: ', data)
}

const GMOnRouteCalculated = data => {
  console.log('== GMOnRouteCalculated ==: ', data)
}

const setupParties = () => {
  let partiesData = JSON.stringify(parties)
  plotPartiesA.value = JSON.parse(partiesData)
  plotPartiesB.value = JSON.parse(partiesData)
}

const onClickPoliticPlotParty = party => {
  party.active = !party.active
  renderPlot()
}

const renderPlot = () => {
  try {
    chartScatterStatus.value = 'rendering plot...'
    let parties = []
    let coalitionA = getSelectedParties(plotPartiesA.value, true)
    let coalitionB = getSelectedParties(plotPartiesB.value, true)
    if (!coalitionA.length || !coalitionB.length)
      throw 'no parties selected'

    let coalitionAName = []
    let coalitionATotal = 0
    let coalitionBName = []
    let coalitionBTotal = 0
    let totalGlobalVotes = 0
    for (let p of coalitionA) {
      coalitionAName.push(p.abr)
      let total = parseInt(townSelected.value.data.model.get(p.abr))
      coalitionATotal = coalitionATotal + total
    }
    for (let p of coalitionB) {
      coalitionBName.push(p.abr)
      let total = parseInt(townSelected.value.data.model.get(p.abr))
      coalitionBTotal = coalitionBTotal + total
    }
    // NOTE: CALC ALL PARTY TOWN VOTES
    let partyTownWinnerVotesData = []
    partyTownWinnerCollection.clear()
    partyTownWinnerCollection = new GLOBAL.$model.ModelMC.collection()
    let partyTownWinnerItems = []
    let coaPropA = `${ coalitionAName.toString().replaceAll(',', '_') }`
    let coaPropB = `${ coalitionBName.toString().replaceAll(',', '_') }`
    clearCustomProps(partyTownWinnerModel, partyTownWinnerDefaultProps)
    for (let model of townSelected.value.data.model.collection.getModels()) {
      
    }
  } catch (err) {
    chartScatterStatus.value = err.toString()
  } finally {
    chartScatterStatus.value = ''
  }
}

const clearCustomProps = (model, defaultProps) => {
  model._attributes = []
  model._mutations = []
  defaultProps = []
}

const getSelectedParties = (parties, getAll = false) => {
  let selectedParties = []
  for (let p of parties)
    if (p.active) {
      if (getAll)
        selectedParties.push(p)
      else
        selectedParties.push(p.abr)
    }
  return selectedParties
}

</script>

<style scoped lang="css">

#coa-parties {
  max-width: 350px;
  margin: auto auto 25px auto;
}

#politic-parties {
  align-self: center;
  display: flex;
  height: 45px;
  justify-content: center;
}

#politic-parties-items {
  align-self: center;
  display: flex;
  gap: 8px;
  z-index: 2;
}

.button {
  position: relative;
  overflow: hidden;
  display: flex;
  height: 45px;
  width: 45px;
  cursor: pointer;
}

.button:hover img {
  border-bottom: 2px solid var(--main-active-color);
}

.button.active img {
  border-bottom: 2px solid  var(--main-accent-color);
}

.button img {
  margin: auto;
  left: -10px;
  right: -10px;
  position: absolute;
  top: -10px;
  bottom: -10px;
  width: calc(100% - 10px);
  border-bottom: 2px solid #00000000;
}

</style>