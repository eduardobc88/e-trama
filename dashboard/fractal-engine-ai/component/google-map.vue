<template>
  <div
    id="box-wrapper">
    <div class="map-container">
      <div
        ref="map_ref"
        class="google-map">
      </div>
      <div
        v-if="isLoading"
        class="loader">
        cargando...
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
const MAP_ID = 'c8cd9c0f2461850e39782461'
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
  GMOnMarker: {
    type: Function,
    default: () => {}
  },
  GMOnRouteCalculated: { // NOTE: NOT IMPLEMENTED
    type: Function,
    default: () => {}
  },
})


// NOTE: REACTIVE VARIABLES

const map_ref = ref(null)
const isLoading = ref(false)


// NOTE: VARIABLES

let map = null
let features = []
let featureMarkers = []
let userMarkers = []
let isFeatureLabelsVisible = true
let isUserMarkersEnabled = false
let isUserMarkersDraggable = false
let isUserMarkersVisible = true
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
  map = new Map(map_ref.value, {
    center: { lat: 19.4326, lng: -99.1332 },
    zoom: 10,
    mapId: MAP_ID,
    zoomControl: true,
    gestureHandling: 'cooperative',
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

  isLoading.value = true
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
  } catch (err) {
    console.error('== loadGeoJSON ==', err)
  } finally {
    isLoading.value = false
  }
}

const setMapCenterByFeatures = () => {
  let bounds = new google.maps.LatLngBounds()
  features.forEach(feature => {
    calcFeatureBounds(feature.getGeometry(), bounds.extend, bounds)
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
    bounds.extend(marker.position)
  })
  map.fitBounds(bounds)
}

const setFeatureMarker = async feature => {
  let bounds = new google.maps.LatLngBounds()
  feature.getGeometry().forEachLatLng((latlng) => {
    bounds.extend(latlng)
  })
  const {
    AdvancedMarkerElement,
  } = await importLibrary('marker')
  let labelDiv = document.createElement('div')
  labelDiv.textContent = feature.nh.nombre
  labelDiv.style.fontSize = '12px'
  labelDiv.style.fontWeight = 'bold'
  labelDiv.style.color = '#222222'
  labelDiv.style.background = feature.nh.data.color
  labelDiv.style.padding = '5px'
  labelDiv.style.borderRadius = '5px'
  labelDiv.style.border = `1px solid ${ feature.nh.data.color }`
  labelDiv.style.boxShadow = `0 3px 4px 2px rgba(0, 0, 0, 0.2)`
  let marker = new AdvancedMarkerElement({
    position: bounds.getCenter(),
    map: map,
    content: labelDiv,
    title: feature.nh.nombre,
  })
  marker.content.addEventListener('animationend', () => {
    marker.content.style.animation = 'none'
  }, { once: true })
  const aleatoryDropDownTime = (Math.random() * (1.0 - 0.4) + 0.4).toFixed(2)
  marker.content.style.animation = `drop-down ${ aleatoryDropDownTime }s ease-in-out forwards`
  featureMarkers.push(marker)
}

const onMarkerDragEnd = (marker) => {
  PROPS.GMOnMarker({
    event: 'drag-end',
    marker: marker,
    markers: userMarkers,
  })
}

const onMarkerClick = function (e) {
  markerSelected = this
}

const addUserMarker = async (e) => {
  PROPS.GMFeatureOnClick(e)
  if (!isUserMarkersEnabled)
    return

  const {
    AdvancedMarkerElement,
    PinElement,
  } = await importLibrary('marker')
  const pin = new PinElement()
  const aleatoryDropDownTime = (Math.random() * (1.0 - 0.4) + 0.4).toFixed(2)
  pin.element.style.animation = `drop-down ${ aleatoryDropDownTime }s ease-in-out forwards`
  let marker = new AdvancedMarkerElement({
    position: e.latLng,
    map: map,
    gmpDraggable: true,
    content: pin.element,
  })
  marker.addListener('click', onMarkerClick)
  userMarkers.push(marker)
  PROPS.GMOnMarker({
    event: 'added',
    marker: marker,
    markers: userMarkers,
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
    marker.content.addEventListener('animationend', () => {
      marker.map = null
      marker.content.style.animation = 'none'
    }, { once: true })
    let aleatoryDropDownTime = (Math.random() * (1.0 - 0.4) + 0.4).toFixed(2)
    marker.content.style.animation = `drop-up ${ aleatoryDropDownTime }s ease-in-out forwards`
  })
  userMarkers = []
  PROPS.GMOnMarker({
    event: 'remove-all',
    markers: userMarkers,
  })
}

const removeUserMarker = () => {
  markerSelected.content.addEventListener('animationend', () => {
    markerSelected.map = null
    markerSelected.content.style.animation = 'none'
    userMarkers = userMarkers.filter(m => m !== markerSelected)
    PROPS.GMOnMarker({
      event: 'remove',
      marker: markerSelected,
      markers: userMarkers,
    })
    markerSelected = null
  }, { once: true })
  let aleatoryDropDownTime = (Math.random() * (1.0 - 0.4) + 0.4).toFixed(2)
  markerSelected.content.style.animation = `drop-up ${ aleatoryDropDownTime }s ease-in-out forwards`
}

const toggleFeatureLabels = () => {
  let isVisible = !isFeatureLabelsVisible
  isFeatureLabelsVisible = isVisible
  if (isVisible) {
    featureMarkers.forEach(marker => {
      marker.map = map
      marker.content.addEventListener('animationend', () => {
        marker.content.style.animation = 'none'
      }, { once: true })
      let aleatoryDropDownTime = (Math.random() * (1.0 - 0.4) + 0.4).toFixed(2)
      marker.content.style.animation = `drop-down ${ aleatoryDropDownTime }s ease-in-out forwards`
    })
    return
  }
  featureMarkers.forEach(marker => {
    marker.content.addEventListener('animationend', () => {
      marker.map = null
      marker.content.style.animation = 'none'
    }, { once: true })
    let aleatoryDropDownTime = (Math.random() * (1.0 - 0.4) + 0.4).toFixed(2)
    marker.content.style.animation = `drop-up ${ aleatoryDropDownTime }s ease-in-out forwards`
  })
}

const toggleUserMarkers = () => {
  isUserMarkersVisible = !isUserMarkersVisible
  if (isUserMarkersVisible) {
    userMarkers.forEach(marker => {
      marker.map = map
      marker.content.addEventListener('animationend', () => {
        marker.content.style.animation = 'none'
      }, { once: true })
      let aleatoryDropDownTime = (Math.random() * (1.0 - 0.4) + 0.4).toFixed(2)
      marker.content.style.animation = `drop-down ${ aleatoryDropDownTime }s ease-in-out forwards`
    })
    return
  }
  userMarkers.forEach(marker => {
    marker.content.addEventListener('animationend', () => {
      marker.map = null
      marker.content.style.animation = 'none'
    }, { once: true })
    let aleatoryDropDownTime = (Math.random() * (1.0 - 0.4) + 0.4).toFixed(2)
    marker.content.style.animation = `drop-up ${ aleatoryDropDownTime }s ease-in-out forwards`
  })
}

const toggleEnableUserMarkers = () => {
  isUserMarkersEnabled = !isUserMarkersEnabled
}

const toggleUserMarkersDraggable = () => {
  isUserMarkersDraggable = !isUserMarkersDraggable
  userMarkers.forEach(marker => {
    marker.gmpDraggable = isUserMarkersDraggable
    marker.addListener('dragend', () => onMarkerDragEnd(marker))
  })
}

const addCustomUIButton = (text, position, callback) => {
  // NOTE: POSITION USE:
  // TOP: TOP_LEFT, TOP_CENTER, TOP_RIGHT
  // LATERALS: LEFT_TOP, RIGHT_TOP, LEFT_CENTER, RIGHT_CENTER
  // BOTTOM: BOTTOM_LEFT, BOTTOM_CENTER, BOTTOM_RIGHT
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

const calcFeatureBounds = (geometry, callback, thisArg) => {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry)
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get())
  } else {
    geometry.getArray().forEach(g => {
      calcFeatureBounds(g, callback, thisArg)
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

<style lang="css">
@keyframes drop-down {
  from { transform: translateY(-500px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes drop-up {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-500px); opacity: 0; }
}

</style>