<template lang="html">
  <div id="wrapper">
    <GoogleMap
      :GMUpdateFeatures="GMUUID"
      :GMTitle="GMTitle"
      :GMFeatures="googleMapFeatures"
      :GMZoomFeatures="8"
      :GMFeatureOnClick="GMFeatureOnClick"
      :GMOnMarker="GMOnMarker"
      :GMOnRouteCalculated="GMOnRouteCalculated"
      :GMFeatureLabelKey="'label'"
      :GMFeatureColorKey="'color'"
      GMInfoBoxHeight="460px"
      GMInfoBoxWidth="250px"
      :GMInfoBoxMarkdownText="GMInfoBoxMarkdownText"
      :GMFilterFeatures="GMFilterFeatures"
      :GMOnZoomChanged="GMOnZoomChanged"
      :GMOnReset="GMOnReset"
      :GMDropDownMenus="GMDropDownMenus"
      :GMOnRowClick="GMOnRowClick"/>
    <GridSpace
      gridTemplateColumns="1fr 2fr">
      <template #slota>
        <Widget
          v-bind:sectionTitle="((GMTitle == '')?'municipio':GMTitle)"
          sectionDescription="datos electorales"
          width="100%"
          minHeight="300px">
          <template v-if="townSelected !== null">
            <template
              v-for="(attrKey, i) of resultDefaultProps">
              <template v-if="townSelected.model.get(attrKey) !== undefined">
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
let GMUUID = ref(GLOBAL.$uuid.v1())
let GMTitle = ref('')
let GMDropDownMenus = ref([])
let federalDistrictFeatureCollection = new GLOBAL.$model.FeatureMC.collection()
let localDistrictFeatureCollection = new GLOBAL.$model.FeatureMC.collection()
let townFeatureCollection = new GLOBAL.$model.FeatureMC.collection()
let sectionFeatureCollection = new GLOBAL.$model.FeatureMC.collection()
let electionTypeCollection = new GLOBAL.$model.ElectionTypeMC.collection()
let federalElectionCollection = new GLOBAL.$model.ElectionMC.collection()
let localElectionCollection = new GLOBAL.$model.ElectionMC.collection()
let townElectionCollection = new GLOBAL.$model.ElectionMC.collection()
let sectionElectionCollection = new GLOBAL.$model.ElectionMC.collection()

let colors = {
  pan: '#00579c',
  pri: '#28b154',
  prd: '#ffd203',
  pt: '#e8132e',
  pvem: '#9fce67',
  mc: '#ff7e00',
  morena: '#a53422',
}
let parties = [
  {
    name: 'movimiento ciudadano',
    abr: 'mc',
    icon: 'mc.png',
    active: true,
  },
  {
    name: 'morena',
    abr: 'morena',
    icon: 'morena.png',
    active: true,
  },
  {
    name: 'partido acción nacional',
    abr: 'pan',
    icon: 'pan.png',
    active: true,
  },
  {
    name: 'partido revolucionario democratico',
    abr: 'prd',
    icon: 'prd.png',
    active: true,
  },
  {
    name: 'partido revolucionario institucional',
    abr: 'pri',
    icon: 'pri.png',
    active: true,
  },
  {
    name: 'partido del trabajo',
    abr: 'pt',
    icon: 'pt.png',
    active: true,
  },
  {
    name: 'partido verde',
    abr: 'pvem',
    icon: 'pv.png',
    active: true,
  },
]
let resultDefaultProps = [
  'id',
  'type',
  'election',
  'scope',
  'header',
  'district_id',
  'district_f_id',
  'district_l_id',
  'town_id',
  'municipio',
  'section_id',
  'votos_mc',
  'votos_morena',
  'votos_pan',
  'votos_pes',
  'votos_prd',
  'votos_pri',
  'votos_pt',
  'votos_pvem',
  'casillas',
  'lista_nominal',
  'num_votos_nulos',
  'num_votos_validos',
  'total_votos',
  'ganador_votos',
  'ganador',
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

// NOTE: MAP COMPONENT PROPERTIES
let GMInfoBoxMarkdownText = ref('')
let GMFilterFeatures = ref({
  property_name: '',
  property_value: '',
  zoom_features: 0,
})
let initDistrictType = 'district_f_id'


onMounted (async () => {
  await setup()
})


const setup = async () => {
  try {
    isLoading.value = true
    await electionTypeCollection.fetch()
    setElectionDropDownMenus()
    await fetchFeatures()
    setupMapFeatures()
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const setElectionDropDownMenus = () => {
  let menu = {
    label: 'election',
    selectOptions: [],
    onSelectOption: GMOnOptionSelected,
  }
  for (let e of electionTypeCollection.getModels()) {
    let name = `${ e.get('type') } ${ e.get('scope') } ${ e.get('election') }`
    menu.selectOptions.push({
      item_name: name,
      item_prop: {
        scope: e.get('scope'),
        election: e.get('election'),
        type: e.get('type'),
      },
      item_value: false,
    })
  }
  GMDropDownMenus.value = [menu]
}

const GMOnOptionSelected = async (prop, data) => {
  data.item_value = !data.item_value
  await fetchElectionData(data)
}

const fetchElectionData = async data => {
  try {
    isLoading.value = true
    federalElectionCollection = new GLOBAL.$model.ElectionMC.collection()
    localElectionCollection = new GLOBAL.$model.ElectionMC.collection()
    townElectionCollection = new GLOBAL.$model.ElectionMC.collection()
    sectionElectionCollection = new GLOBAL.$model.ElectionMC.collection()
    let fetchPromiseItems = []
    let scope = []
    let election = []
    let type = []
    for (let option of GMDropDownMenus.value[0].selectOptions) {
      if (!option.item_value)
        continue

      scope.push(option.item_prop.scope)
      election.push(option.item_prop.election)
      type.push(option.item_prop.type)
    }
    let scopeStr = scope.join(',')
    let electionStr = election.join(',')
    let typeStr = type.join(',')
    federalElectionCollection.set({
      scope: scopeStr,
      election: electionStr,
      type: typeStr,
    })
    localElectionCollection.set({
      scope: scopeStr,
      election: electionStr,
      type: typeStr,
    })
    townElectionCollection.set({
      scope: scopeStr,
      election: electionStr,
      type: typeStr,
    })
    sectionElectionCollection.set({
      scope: scopeStr,
      election: electionStr,
      type: typeStr,
    })
    fetchPromiseItems.push(federalElectionCollection.fetchResultFederal())
    fetchPromiseItems.push(localElectionCollection.fetchResultLocal())
    fetchPromiseItems.push(townElectionCollection.fetchResultTown())
    fetchPromiseItems.push(sectionElectionCollection.fetchResultSection())
    await Promise.all(fetchPromiseItems)
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
    matchFeatureWithElectionData()
  }
}

const matchFeatureWithElectionData = async () => {
  // NOTE: FEDERAL DISTRICT
  for (let feature of googleMapFeatures.value[8]) {
    let model = null
    for (let option of GMDropDownMenus.value[0].selectOptions) {
      if (!option.item_value)
        continue

      let featureDistrictId = parseInt(feature.properties.district_id)
      for (let m of federalElectionCollection.getModels())
        if (parseInt(m.get('id')) === featureDistrictId) {
          model = m
          break
        }
      if (model !== null)
        break
    }
    if (model === null)
      continue

    feature.properties.model_id = model.get('id')
    feature.properties.color = colors[model.get('ganador')]
    feature.properties.label = `${ feature.properties.model.get('name') } ${ feature.properties.model.get('header') } \n ${ model.get('total_votos') } \n ${ model.get('ganador') }: ${ model.get('ganador_votos') }`
  }
  // NOTE: LOCAL DISTRICT
  for (let feature of googleMapFeatures.value[9]) {
    let model = null
    for (let option of GMDropDownMenus.value[0].selectOptions) {
      if (!option.item_value)
        continue

      let featureDistrictId = parseInt(feature.properties.district_id)
      for (let m of localElectionCollection.getModels())
        if (parseInt(m.get('id')) === featureDistrictId) {
          model = m
          break
        }
      if (model !== null)
        break
    }
    if (model === null)
      continue

    feature.properties.model_id = model.get('id')
    feature.properties.color = colors[model.get('ganador')]
    feature.properties.label = `${ feature.properties.model.get('name') } ${ feature.properties.model.get('header') } \n ${ model.get('total_votos') } \n ${ model.get('ganador') }: ${ model.get('ganador_votos') }`
  }
  // NOTE: TOWN
  for (let feature of googleMapFeatures.value[10]) {
    let model = null
    for (let option of GMDropDownMenus.value[0].selectOptions) {
      if (!option.item_value)
        continue

      let featureTownId = parseInt(feature.properties.town_id)
      for (let m of townElectionCollection.getModels())
        if (parseInt(m.get('id')) === featureTownId) {
          model = m
          break
        }
      if (model !== null)
        break
    }
    if (model === null)
      continue

    feature.properties.model_id = model.get('id')
    feature.properties.color = colors[model.get('ganador')]
    feature.properties.label = `${ feature.properties.model.get('name') } ${ feature.properties.model.get('header') } \n ${ model.get('total_votos') } \n ${ model.get('ganador') }: ${ model.get('ganador_votos') }`
  }
  // NOTE: SECTION
  for (let feature of googleMapFeatures.value[11]) {
    let model = null
    for (let option of GMDropDownMenus.value[0].selectOptions) {
      if (!option.item_value)
        continue

      let featureSectionId = parseInt(feature.properties.section_id)
      for (let m of sectionElectionCollection.getModels())
        if (parseInt(m.get('id')) === featureSectionId) {
          model = m
          break
        }
      if (model !== null)
        break
    }
    if (model === null)
      continue

    feature.properties.model_id = model.get('id')
    feature.properties.color = colors[model.get('ganador')]
    feature.properties.label = `${ feature.properties.model.get('name') } ${ feature.properties.model.get('header') } \n ${ model.get('total_votos') } \n ${ model.get('ganador') }: ${ model.get('ganador_votos') }`
  }
  GMUUID.value = GLOBAL.$uuid.v1()
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
        color: GLOBAL.$getHexColor(`${ m.get('id') } ${ m.get('name') } ${m.get('header')}`, true, 20, 50, 100),
        show: true,
        header: m.get('header'),
        description: m.get('description'),
        model_id: 0,
        model: m,
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
        zoom: 9,
        color: GLOBAL.$getHexColor(`${ m.get('id') } ${ m.get('name') } ${m.get('header')}`, true, 20, 50, 100),
        show: true,
        header: m.get('header'),
        description: m.get('description'),
        model_id: 0,
        model: m,
      },
      type: 'Feature',
    }
    features.push(feature)
  }
  gmFeatures[9] = features
  features = []
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
        color: GLOBAL.$getHexColor(`${ m.get('id') } ${ m.get('name') } ${ m.get('town_id') }`, true, 20, 50, 100),
        show: true,
        description: m.get('description'),
        model_id: 0,
        model: m,
      },
      type: 'Feature',
    }
    features.push(feature)
  }
  gmFeatures[10] = features
  features = []
  for (let m of sectionFeatureCollection.getModels()) {
    let feature = {
      geometry: JSON.parse(m.get('geometry')),
      properties: {
        id: m.get('id'),
        section_id: m.get('section_id'),
        town_id: m.get('town_id'),
        district_f_id: m.get('district_f_id'),
        district_l_id: m.get('district_l_id'),
        label: m.get('section_id'),
        zoom: 11,
        color: GLOBAL.$getHexColor(`${ m.get('id') } ${ m.get('section_id') } ${ m.get('district_f_id') } ${ m.get('district_l_id') }`, true, 20, 50, 100),
        show: true,
        description: m.get('description'),
        model_id: 0,
        model: m,
      },
      type: 'Feature',
    }
    features.push(feature)
  }
  gmFeatures[11] = features
  googleMapFeatures.value = gmFeatures
  setFeaturesTitle(8)
}

const GMFeatureOnClick = data => {
  let zoomFeatures = 8
  GMInfoBoxMarkdownText.value = data.feature.getProperty('description')
  let featureZoom = data.feature.getProperty('zoom')
  if (featureZoom === 8) {
    initDistrictType = 'district_f_id'
    zoomFeatures = 9
  } else if (featureZoom === 9)
    initDistrictType = 'district_l_id'
  if (data.feature.getProperty('zoom') === 8 || data.feature.getProperty('zoom') === 9) {
    GMFilterFeatures.value = {
      property_name: initDistrictType,
      property_value: data.feature.getProperty('district_id').toString(),
      zoom_features: 10,
    }
    zoomFeatures = 10
  } else if (data.feature.getProperty('zoom') === 10) {
    GMFilterFeatures.value = {
      property_name: 'town_id',
      property_value: data.feature.getProperty('town_id').toString(),
      zoom_features: 11,
    }
    zoomFeatures = 11
  }
  setFeaturesTitle(zoomFeatures, data.feature.getProperty('label'))
  let id = data.feature.getProperty('model_id')
  refreshChartData(featureZoom, id)
}

const GMOnRowClick = data => {
  let featureZoom = data.feature.getProperty('zoom')
  let id = data.feature.getProperty('model_id')
  refreshChartData(featureZoom, id)
}

const refreshChartData = (zoom, modelId) => {
  let featureZoom = zoom
  let collection = null
  let id = modelId
  if (featureZoom === 8)
    collection = federalElectionCollection.filter(f => f.get('id') === id)
  else if (featureZoom === 9)
    collection = localElectionCollection.filter(f => f.get('id') === id)
  else if (featureZoom === 10)
    collection = townElectionCollection.filter(f => f.get('id') === id)
  else if (featureZoom === 11)
    collection = sectionElectionCollection.filter(f => f.get('id') === id)
  townSelected.value = {
    model: collection.getModels()[0],
    data: {},
  }
  generateChart()
}

const generateChart = async () => {
  let chartDataSets = []
  for (let key of Object.keys(parties)) {
    if (!parties[key].active)
      continue

    let partyAbr = parties[key].abr
    let partyName = parties[key].name
    let propPartyName = `votos_${ partyAbr }`
    let color = colors[partyAbr]
    let label = partyName
    let total = townSelected.value.model.get(propPartyName)
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

const GMOnZoomChanged = data => {
  setFeaturesTitle(data.zoom_features)
}

const GMOnReset = data => {
  setFeaturesTitle(data.zoom_features)
}

const setFeaturesTitle = (zoomFeatures, label = '') => {
  let title = label
  if (zoomFeatures <= 8)
    title = 'DISTRITOS FEDERALES'
  else if (zoomFeatures === 9)
    title = 'DISTRITOS LOCALES'
  else if (zoomFeatures === 10)
    title = 'MUNICIPIOS'
  else if (zoomFeatures >= 11)
    title = 'SECCIONES'
  if (label !== '')
    title = `${ title }\n${ label }`
  GMTitle.value = title
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