<template>
  <div
    id="box-wrapper">
    <div class="map-container">
      <div
        ref="MAP_REF"
        class="google-map">
      </div>
      <div
        v-if="LOADING_REF"
        class="loader">
          LOADING_REF...
      </div>
    </div>
  </div>
</template>

<script setup>
// TODO: SHOW DIVISION FEATURES ACCORDING TO ZOOM
// TODO: LET USER PUT MARKERS AND RETURN MARKERS INFO
// TODO: TRACE ROUTE BETWEEN TWO POINTS AND RETURN ROUTE INFO
// NOTE: GMFeatures USE THE GLOBAL GEOJSON VARS: GEOJSON_SECCION, GEOJSON_DISTRITO_LOCAL, GEOJSON_DISTRITO_FEDERAL, GEOJSON_MUNICIPIO

import {
  getCurrentInstance,
  onMounted,
  ref,
  watch
} from 'vue'
import {
  setOptions,
  importLibrary
} from "@googlemaps/js-api-loader"


// NOTE: INITIALIZE

setOptions({
  key: 'AIzaSyB4KbCGbEFrsYLxaAxORNNJVq_ob1Or7fY',
})
const INSTANCE = getCurrentInstance()
const GLOBAL = INSTANCE.appContext.config.globalProperties


// NOTE: COMPONENT PROPERTIES

const PROPS = defineProps({
  GMFeatures: {
    type: Array,
    default: []
  },
  GMFeatureOnClick: {
    type: Function,
    default: () => {}
  },
  GMOnMarkerAdded: {
    type: Function,
    default: () => {}
  },
  GMOnMarkerDragEnd: {
    type: Function,
    default: () => {}
  },
  GMOnRouteCalculated: { // NOTE: NOT IMPLEMENTED
    type: Function,
    default: () => {}
  },
})


// NOTE: REACTIVE VARIABLES

const MAP_REF = ref(null)
const LOADING_REF = ref(false)


// NOTE: VARIABLES

let map = null
let features = []
let featureMarkers = []
let userMarkers = []
let isFeatureLabelsVisible = false
let isUserMarkersEnabled = false
let isUserMarkersDraggable = false
let isUserMarkersVisible = false
let markerSelected = null


// NOTE: LIFE CYCLE COMPONENT METHODS

watch(() => PROPS.GMFeatures, newData => {
  loadGeoJSON({
    features: PROPS.GMFeatures,
    type: 'FeatureCollection'
  })
})

onMounted (async () => {
  const { Map } = await importLibrary('maps')
  map = new Map(MAP_REF.value, {
    center: { lat: 19.4326, lng: -99.1332 },
    zoom: 10,
    mapId: 'DEMO_MAP_ID', // Requerido para 3D y estilos avanzados
  })
  loadGeoJSON({
    features: PROPS.GMFeatures,
    type: 'FeatureCollection'
  })
})


// NOTE: METHODS

const loadGeoJSON = async (geoJSON) => {
  if (!map || !geoJSON)
    return

  LOADING_REF.value = true
  map.data.forEach((feature) => {
    map.data.remove(feature)
  })
  try {
    features = map.data.addGeoJson(geoJSON)
    features.forEach(feature => {
      setFeatureMarker(feature)
    })
    setMapCenterByFeatures()
    removeMapListeners()
    setMapListeners()
    setFeatureStyles()
    setDefaultUIButtons()
    console.log(`== loadGeoJSON ==: ${ features.length } features added to map`)
  } catch (err) {
    console.error('== loadGeoJSON ==', err)
  } finally {
    LOADING_REF.value = false
  }
}

const setMapCenterByFeatures = () => {
  let bounds = new google.maps.LatLngBounds()
  features.forEach(feature => {
    calcBounds(feature.getGeometry(), bounds.extend, bounds)
  })
  map.fitBounds(bounds)
}

const setFeatureStyles = () => {
  map.data.setStyle({})
  map.data.setStyle(feature => {
    return {
      fillColor: feature.nh.data.color,
      fillOpacity: 0.7,
      strokeColor: '#222222',
      strokeWeight: 1,
      visible: true,
    }
  })
}

const setMapListeners = () => {
  map.data.addListener('click', addUserMarker)
  map.addListener('click', addUserMarker)
}

const removeMapListeners = () => {
  google.maps.event.clearListeners(map.data, 'click')
}

const setMapCenterByUserMarkers = () => {
  let bounds = new google.maps.LatLngBounds()
  userMarkers.forEach(marker => {
    calcBounds(marker.getPosition(), bounds.extend, bounds)
  })
  map.fitBounds(bounds)
}

const setFeatureMarker = feature => {
  let bounds = new google.maps.LatLngBounds()
  feature.getGeometry().forEachLatLng((latlng) => {
    bounds.extend(latlng)
  })
  let marker = new google.maps.Marker({
    position: bounds.getCenter(),
    map: map,
    icon: {
      url: '',
      size: new google.maps.Size(0, 0)
    },
    label: {
      text: feature.nh.nombre,
      color: '#eeeeee',
      fontSize: '12px',
      fontWeight: 'bold'
    },
  })
  featureMarkers.push(marker)
}

const onMarkerDragEnd = (e) => {
  const lat = e.latLng.lat()
  const lng = e.latLng.lng()
  PROPS.GMOnMarkerDragEnd({
    lat: lat,
    lng: lng,
    marker: e.marker, // TODO: is undefined then use AdvancedMarkerElement for create markers
    allMarkers: userMarkers
  })
}

const onMarkerClick = function (e) {
  markerSelected = this
}

const addUserMarker = (e) => {
  PROPS.GMFeatureOnClick(e)
  if (!isUserMarkersEnabled)
    return

  const marker = new google.maps.Marker({
    position: e.latLng,
    map: map,
    draggable: isUserMarkersDraggable,
    title: 'DRAG ME',
  })
  marker.addListener('click', onMarkerClick)
  userMarkers.push(marker)
  PROPS.GMOnMarkerAdded({
    lat: e.latLng.lat(),
    lng: e.latLng.lng(),
    marker: marker,
    allMarkers: userMarkers
  })
}

const setDefaultUIButtons = () => {
  addCustomUIButton('CENTER ON FEATURES', 'TOP_RIGHT', setMapCenterByFeatures)
  addCustomUIButton('CENTER ON USER MARKERS', 'TOP_RIGHT', setMapCenterByUserMarkers)
  addCustomUIButton('SHOW FEATURE LABELS', 'TOP_RIGHT', toggleFeatureLabels)
  addCustomUIButton('SHOW USER MARKERS', 'TOP_RIGHT', toggleUserMarkers)
  addCustomUIButton('ENABLE USER MARKERS', 'TOP_RIGHT', toggleEnableUserMarkers)
  addCustomUIButton('DRAG USER MARKERS', 'TOP_RIGHT', toggleUserMarkersDraggable)
  addCustomUIButton('REMOVE USER MARKERS', 'TOP_RIGHT', removeUserMarkers)
  addCustomUIButton('REMOVE USER MARKER', 'TOP_RIGHT', removeUserMarker)
}

const removeUserMarkers = () => {
  userMarkers.forEach(marker => {
    marker.setMap(null)
  })
  userMarkers = []
  PROPS.GMOnMarkerAdded({})
}

const removeUserMarker = () => {
  markerSelected.setMap(null)
  userMarkers = userMarkers.filter(m => m !== markerSelected)
  markerSelected = null
  PROPS.GMOnMarkerAdded({})
}

const toggleFeatureLabels = () => {
  isFeatureLabelsVisible = !isFeatureLabelsVisible
  featureMarkers.forEach(marker => {
    marker.setVisible(isFeatureLabelsVisible)
  })
}

const toggleUserMarkers = () => {
  isUserMarkersVisible = !isUserMarkersVisible
  userMarkers.forEach(marker => {
    marker.setVisible(isUserMarkersVisible)
  })
}

const toggleEnableUserMarkers = () => {
  isUserMarkersEnabled = !isUserMarkersEnabled
}

const toggleUserMarkersDraggable = () => {
  isUserMarkersDraggable = !isUserMarkersDraggable
  userMarkers.forEach(marker => {
    marker.setDraggable(isUserMarkersDraggable)
    marker.addListener('dragend', onMarkerDragEnd)
  })
}

const addCustomUIButton = (text, position, callback) => {
  // NOTE: POSITION USE:
  //TOP: TOP_LEFT, TOP_CENTER, TOP_RIGHT
  //LATERALS: LEFT_TOP, RIGHT_TOP, LEFT_CENTER, RIGHT_CENTER
  //BOTTOM: BOTTOM_LEFT, BOTTOM_CENTER, BOTTOM_RIGHT
  const controlDiv = document.createElement('div')
  const controlUI = document.createElement('button')
  controlUI.style.backgroundColor = '#fff'
  controlUI.style.border = '2px solid #fff'
  controlUI.style.padding = '5px 10px'
  controlUI.style.cursor = 'pointer'
  controlUI.style.margin = '5px'
  controlUI.textContent = text
  controlDiv.appendChild(controlUI)
  controlUI.addEventListener('click', callback)
  map.controls[google.maps.ControlPosition[position]].push(controlDiv)
}

const calcBounds = (geometry, callback, thisArg) => {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry)
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get())
  } else {
    geometry.getArray().forEach(g => {
      calcBounds(g, callback, thisArg)
    })
  }
}

</script>

<style scoped lang="css">
#box-wrapper {
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  box-shadow: var(--main-box-shadow);
  margin: 0 6px;
  position: relative;
  transition-duration: 500ms;
  overflow: hidden;
}

.map-container {
  position: relative;
  width: 100%;
  height: 420px;
}

.google-map {
  width: 100%;
  height: 100%;
}

.loader { 
  position: absolute;
  top: 10px;
  left: 10px; 
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

</style>

