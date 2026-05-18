<template lang="html">
  <div id="wrapper">
    <GoogleMap
      :GMTitle="GMTitle"
      :GMFeatures="googleMapFeatures"
      :GMFeatureOnClick="GMFeatureOnClick"
      :GMOnMarker="GMOnMarker"
      :GMOnRouteCalculated="GMOnRouteCalculated"
      :GMFeatureLabelKey="'seccion'"
      :GMFeatureColorKey="'color'"/>
    <GridSpace
      gridTemplateColumns="1fr 2fr">
      <template #slota>
        <Widget
          v-bind:sectionTitle="((GMTitle == '')?'municipio':GMTitle)"
          sectionDescription="datos electorales"
          width="100%"
          minHeight="300px">
          <template v-if="townSelected !== null">
            <div
              v-if="townSelected.data.coa === 'coa'"
              class="item-definition">
              <div
                class="icon"
                v-bind:style="{
                  'background-color': '#00629f',
                }">
              </div>
              <div class="text">
                <span>coalición:</span> {{ townSelected.data.party.replaceAll('_', ', ') }}
              </div>
            </div>
            <div
              v-if="townSelected.data.coa === 'coa'"
              class="item-definition">
              <div
                class="icon"
                v-bind:style="{
                  'background-color': '#00629f',
                }">
              </div>
              <div class="text">
                <span>coa total:</span> {{ townSelected.data.coa_total }}
              </div>
            </div>
            <div
              v-if="townSelected.data.coa === ''"
              class="item-definition">
              <div
                class="icon"
                v-bind:style="{
                  'background-color': '#00629f',
                }">
              </div>
              <div class="text">
                <span>partido:</span> {{ townSelected.data.party }}
              </div>
            </div>
            <div
              v-if="townSelected.data.coa === ''"
              class="item-definition">
              <div
                class="icon"
                v-bind:style="{
                  'background-color': '#00629f',
                }">
              </div>
              <div class="text">
                <span>total:</span> {{ townSelected.data.single_total }}
              </div>
            </div>
            <hr />
            <template
              v-for="(attrKey, i) of resultDefaultProps">
              <div
                class="item-definition">
                <div
                  class="icon"
                  v-bind:style="{
                    'background-color': '#00629f',
                  }">
                </div>
                <div class="text">
                  <span>{{ attrKey.replaceAll('_', ' ') }}:</span> {{ townSelected.data.model.get(attrKey) }}
                </div>
              </div>
            </template>
            <!--<Button
              buttonIcon="feed"
              v-bind:buttonAction="showCard">
              ficha política
            </Button>-->
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
            <BarChart
              :key="chartAKey"
              v-bind:chartData="chartData"
              v-bind:chartOptions="chartOptions"/>
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


onMounted (async () => {
  await setup()
})


const setup = async () => {
  try {
    isLoading.value = true
    resultCollection.set('state', 'michoacán')
    await resultCollection.fetch()
    //setupMap()
    setupMapSection()
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

const setupMapSection = () => {
  let features = []
  for (let i in GEOJSON_SECCION.features) {
    let feature = {}
    let townId = parseInt(GEOJSON_SECCION.features[i].properties.municipio)
    let models = resultCollection.filter(m => {
      let id = parseInt(m.get('id'))
      return (townId === id)
    })
    if (!models.getModels().length)
      continue

    let rModel = models.getModels()[0]
    let id = rModel.get('town_id')
    let rName = rModel.get('name')
    feature = GEOJSON_SECCION.features[i]
    feature.properties.data = {
      id: id,
      name: rName,
      coa_total: 0,
      single_total: 0,
      model: rModel,
      coa: '',
      party: '',
      seccion: feature.properties.seccion,
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
  generateChart()
}

const generateChart = async () => {
  let chartDataSets = []
  for (let key of Object.keys(colors)) {
    if (key === 'activo')
      continue

    let color = colors[key]
    let label = key.replaceAll('_', ' ')
    let total = townSelected.value.data.model.get(key)
    chartDataSets.push({
      label: label,
      backgroundColor: color,
      data: [
        total,
      ],
    })
  }
  chartData.value.datasets = chartDataSets
  chartData.value.labels = ['PARTIDOS POLÍTICOS']
  chartAKey.value = GLOBAL.$uuid.v1()
}

const GMOnMarker = data => {
  console.log('== GMOnMarker ==: ', data)
}

const GMOnRouteCalculated = data => {
  console.log('== GMOnRouteCalculated ==: ', data)
}

</script>

<style scoped lang="css">

.item-definition {
  display: flex;
  height: 25px;
  align-items: center;
}

.item-definition .icon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.item-definition .text {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  text-transform: uppercase;
  padding: 0 0 0 6px;
  line-height: var(--main-font-size);
  margin: auto 0 auto 0;
}

.item-definition .text span {
  font-weight: bold;
}

.item-definition.center {
  display: flex;
  justify-content: center;
}

</style>