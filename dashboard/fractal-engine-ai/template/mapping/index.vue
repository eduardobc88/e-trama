<template lang="html">
  <div id="wrapper">
    <GoogleMap
      :GMTitle="GMTitle"
      :GMFeatures="googleMapFeatures"
      :GMZoomFeatures="8"
      :GMFeatureOnClick="GMFeatureOnClick"
      :GMOnMarker="GMOnMarker"
      :GMOnRouteCalculated="GMOnRouteCalculated"
      :GMFeatureLabelKey="'label'"
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
                  <span>{{ attrKey.replaceAll('_', ' ') }}:</span> {{ townSelected.model.get(attrKey) }}
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
let googleMapFeatures = ref({})
let townSelected = ref(null)
let GMTitle = ref('')
let federalDistrictFeatureCollection = new GLOBAL.$model.FeatureMC.collection()
let localDistrictFeatureCollection = new GLOBAL.$model.FeatureMC.collection()
let townFeatureCollection = new GLOBAL.$model.FeatureMC.collection()
let sectionFeatureCollection = new GLOBAL.$model.FeatureMC.collection()
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
    let response = await fetchFeatures()
    if (response.error !== null)
      throw response.error
    setupMapFeatures()
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const fetchFeatures = async () => {
  let response = {
    error: null,
  }
  try {
    isLoading.value = true
    federalDistrictFeatureCollection.set('feature_type', 'federal-district')
    localDistrictFeatureCollection.set('feature_type', 'local-district')
    townFeatureCollection.set('feature_type', 'town')
    sectionFeatureCollection.set('feature_type', 'section')
    await Promise.all([
      federalDistrictFeatureCollection.fetchAll(),
      localDistrictFeatureCollection.fetchAll(),
      townFeatureCollection.fetchAll(),
      sectionFeatureCollection.fetchAll(),
    ])
  } catch (err) {
    response.error = err.toString()
    console.error('== fetchFeatures ==', err)
  } finally {
    isLoading.value = false
    return response
  }
}

const setupMapFeatures = () => {
  let gmFeatures = {}
  let features = []
  for (let m of federalDistrictFeatureCollection.getModels()) {
    let feature = {
      geometry: JSON.parse(m.get('geometry')),
      properties: {
        id: m.get('id'),
        district_id: m.get('district_id'),
        label: `${ m.get('name') } ${ m.get('header') }`,
        zoom: 8,
        color: GLOBAL.$getHexColor(`${ m.get('name') } ${m.get('header')}`, true, 20, 50, 100),
        show: true,
        header: m.get('header'),
        description: m.get('description'),
        model_id: 0,
      },
      type: 'Feature',
    }
    features.push(feature)
  }
  gmFeatures[8] = features
  features = []
  for (let m of localDistrictFeatureCollection.getModels()) {
    let feature = {
      geometry: JSON.parse(m.get('geometry')),
      properties: {
        id: m.get('id'),
        district_id: m.get('district_id'),
        label: `${ m.get('name') } ${m.get('header')}`,
        zoom: 8,
        color: GLOBAL.$getHexColor(`${ m.get('name') } ${m.get('header')}`, true, 20, 50, 100),
        show: true,
        header: m.get('header'),
        description: m.get('description'),
        model_id: 0,
      },
      type: 'Feature',
    }
    features.push(feature)
  }
  gmFeatures[9] = features
  gmFeatures[10] = setupTownFeaturesMap()
  //  let feature = {
  //    geometry: JSON.parse(m.get('geometry')),
  //    properties: {
  //      id: m.get('id'),
  //      section_id: m.get('section_id'),
  //      town_id: m.get('town_id'),
  //      district_f_id: m.get('district_f_id'),
  //      district_l_id: m.get('district_l_id'),
  //      label: m.get('name'),
  //      zoom: 11,
  //      color: 'rgba(30, 150, 220, 1)',
  //      show: true,
  //      description: m.get('description'),
  //      model: {},
  //    },
  //    type: 'Feature',
  //  }
  //  features.push(feature)
  //}
  //gmFeatures[11] = features
  gmFeatures[11] = setupSectionFeaturesMap()
  googleMapFeatures.value = gmFeatures
}

const setupTownFeaturesMap = () => {
  let features = []
    for (let m of townFeatureCollection.getModels()) {
    let feature = {
      geometry: JSON.parse(m.get('geometry')),
      properties: {
        id: m.get('id'),
        town_id: m.get('town_id'),
        district_f_id: m.get('district_f_id'),
        district_l_id: m.get('district_l_id'),
        label: m.get('name'),
        zoom: 10,
        color: 'rgba(200, 90, 90, 1)',
        show: true,
        description: m.get('description'),
        model_id: 0,
      },
      type: 'Feature',
    }
    let iName = removeAccents(feature.properties.label).toLowerCase()
    let models = resultCollection.filter(m => {
      let mName = removeAccents(m.get('name')).toLowerCase()
      return (mName === iName)
    })
    if (!models.getModels().length)
      continue

    let rModel = models.getModels()[0]
    feature.properties.model_id = rModel.get('id')
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
    feature.properties.party = singleKey
    feature.properties.color = colors[singleKey]
    if (coaKey.includes(singleKey) && coaTotalVotes > singleTotalVotes) {
      feature.properties.coa = 'coa'
      feature.properties.party = coaKey.toString()
      feature.properties.color = colors[coaKey]
    }
    feature.properties.coa_total = coaTotalVotes
    feature.properties.single_total = singleTotalVotes
    features.push(feature)
  }
  return features
}

const setupSectionFeaturesMap = () => {
  let features = []
  for (let m of sectionFeatureCollection.getModels()) {
    let feature = {
      geometry: JSON.parse(m.get('geometry')),
      properties: {
        id: m.get('id'),
        section_id: m.get('section_id'),
        town_id: m.get('town_id'),
        district_f_id: m.get('district_f_id'),
        district_l_id: m.get('district_l_id'),
        label: m.get('name'),
        zoom: 11,
        color: 'rgba(30, 150, 220, 1)',
        show: true,
        description: m.get('description'),
        model_id: 0,
      },
      type: 'Feature',
    }
    let townId = parseInt(feature.properties.town_id)
    let models = resultCollection.filter(m => {
      let id = parseInt(m.get('id'))
      return (townId === id)
    })
    if (!models.getModels().length)
      continue

    let rModel = models.getModels()[0]
    feature.properties.model_id = rModel.get('id')
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
    feature.properties.party = singleKey
    feature.properties.color = colors[singleKey]
    if (coaKey.includes(singleKey) && coaTotalVotes > singleTotalVotes) {
      feature.properties.coa = 'coa'
      feature.properties.party = coaKey.toString()
      feature.properties.color = colors[coaKey]
    }
    feature.properties.coa_total = coaTotalVotes
    feature.properties.single_total = singleTotalVotes
    features.push(feature)
  }
  return features
}

const removeAccents = str => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const GMFeatureOnClick = data => {
  if (data.feature.nh.zoom === 10) {
    let featureModelId = data.feature.nh.model_id
    let models = resultCollection.filter(m => {
      return (m.get('id') === featureModelId)
    })
    if (!models.getModels().length)
      return

    let rModel = models.getModels()[0]
    townSelected.value = {
      model: rModel,
      data: {},
    }
    GMTitle.value = townSelected.value.model.get('name')
    generateChart()
  }
}

const generateChart = async () => {
  let chartDataSets = []
  for (let key of Object.keys(colors)) {
    if (key === 'activo')
      continue

    let color = colors[key]
    let label = key.replaceAll('_', ' ')
    let total = townSelected.value.model.get(key)
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