<template>
  <div
    id="box-wrapper">
    <div id="map-container">
      <div
        v-if="PROPS.GMTitle !== ''"
        class="title">
        {{ PROPS.GMTitle }} ({{ totalShowFeatures }})
      </div>
      <div
        v-if="PROPS.GMInfoBoxMarkdownText !== ''"
        id="info-box">
        <Widget
          v-bind:sectionTitle="((PROPS.GMTitle == '')?'title':PROPS.GMTitle)"
          sectionDescription="description"
          :width="PROPS.GMInfoBoxWidth"
          :height="PROPS.GMInfoBoxHeight">
          <Markdown
            :MDHeight="`calc(${ PROPS.GMInfoBoxHeight } - 80${ 'px' })`"
            :MDText="PROPS.GMInfoBoxMarkdownText"/>
        </Widget>
      </div>
      <div
        ref="map_ref"
        class="google-map">
      </div>
      <div
        v-if="isLoading"
        id="loader">
        <p>cargando...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Markdown from './markdown.vue'
import Widget from './widget.vue'

import {
  getCurrentInstance,
  onMounted,
  ref,
  watch,
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
  GMInfoBoxHeight: {
    type: String,
    default: '460px'
  },
  GMInfoBoxWidth: {
    type: String,
    default: '100%'
  },
  GMTitle: {
    type: String,
    default: ''
  },
  GMFeatures: {
    type: Object,
    default: {},
  },
  GMFeatureOnClick: {
    type: Function,
    default: () => {},
  },
  GMOnMarker: {
    type: Function,
    default: () => {},
  },
  GMOnRouteCalculated: {
    type: Function,
    default: () => {},
  },
  GMFeatureLabelKey: {
    type: String,
    default: '',
  },
  GMFeatureColorKey: {
    type: String,
    default: '',
  },
  GMOnZoomChanged: {
    type: Function,
    default: () => {},
  },
  GMOnBoundsChanged: {
    type: Function,
    default: () => {},
  },
  GMOnCenterChanged: {
    type: Function,
    default: () => {},
  },
  GMZoomFeatures: {
    type: Number,
    default: 0,
  },
  GMInfoBoxMarkdownText: {
    type: String,
    default: '',
  },
  GMFilterFeatures: {
    type: Object,
    default: {
      property_name: '',
      property_value: '',
      zoom_features: 0,
    },
  },
})


// NOTE: REACTIVE VARIABLES

const map_ref = ref(null)
const isLoading = ref(false)


// NOTE: VARIABLES

let map = null
let totalShowFeatures = ref(0)
let showZoomFeatures = ref(0)
let isZoomNavigation = ref(true)
let features = []
let featureMarkers = []
let userMarkers = []
let isFeatureLabelsVisible = true
let isUserMarkersEnabled = false
let isUserMarkersDraggable = true
let isUserMarkersVisible = true
let markerSelected = null
let isFeaturesVisible = true


// NOTE: LIFE CYCLE COMPONENT METHODS

watch(() => PROPS.GMFeatures, newData => {
  loadCurrentZoomFeatures()
})

watch(() => PROPS.GMFilterFeatures, newData => {
  let total = 0
  for (let feature of PROPS.GMFeatures[newData.zoom_features]) {
    feature.properties.show = false
    if (feature.properties[newData.property_name].toString().split(',').includes(newData.property_value)) {
      feature.properties.show = true
      total++
    }
  }
  totalShowFeatures.value = total
  showZoomFeatures.value = newData.zoom_features
})

watch(showZoomFeatures, newData => {
  loadCurrentZoomFeatures()
})

watch(isZoomNavigation, newData => {
  resetZoomGMFeatures()
})


onMounted (async () => {
  initMap()
})


const initMap = async () => {
  isLoading.value = true
  const { Map } = await importLibrary('maps')
  map = new Map(map_ref.value, {
    center: { lat: 19.7294854, lng: -101.1763666 },
    zoom: PROPS.GMZoomFeatures,
    mapId: MAP_ID,
    zoomControl: true,
    gestureHandling: 'cooperative',
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    panControl: false,
  })
  setMapListeners()
  setDefaultUIButtons()
  showZoomFeatures.value = PROPS.GMZoomFeatures
}

const resetMap = () => {
  map.data.forEach((feature) => {
    map.data.remove(feature)
  })
  featureMarkers.forEach(feature => {
    feature.setMap(null)
  })
  features = []
  featureMarkers = []
}


// NOTE: METHODS

const loadCurrentZoomFeatures = () => {
  loadGeoJSON({
    features: PROPS.GMFeatures[showZoomFeatures.value],
    type: 'FeatureCollection'
  })
}

const loadGeoJSON = async geoJSON => {
  if (!map || !geoJSON || !geoJSON.features)
    return
  
  if (!geoJSON.features.length)
    return

  isLoading.value = true
  try {
    resetMap()
    geoJSON.features = geoJSON.features.filter(feature => feature.properties.show)
    features = map.data.addGeoJson(geoJSON)
    features.forEach(feature => {
      setFeatureMarker(feature)
    })
    setFeatureStyles()
  } catch (err) {
    console.error('== loadGeoJSON ==', err)
  } finally {
    isLoading.value = false
  }
}

const setMapCenterByFeatures = (type = 'fitBounds') => {
  let bounds = new google.maps.LatLngBounds()
  features.forEach(feature => {
    calcFeatureBounds(feature.getGeometry(), bounds.extend, bounds)
  })
  if (type === 'fitBounds') {
    map.fitBounds(bounds)
    return
  }
  if (type === 'setCenter')
    map.setCenter(bounds.getCenter())
}

const setFeatureStyles = () => {
  map.data.setStyle({})
  map.data.setStyle(feature => {
    return {
      fillColor: feature.getProperty(PROPS.GMFeatureColorKey),
      fillOpacity: 0.3,
      strokeColor: '#222222',
      strokeWeight: 1,
      visible: true,
    }
  })
}

const setMapListeners = () => {
  map.data.addListener('click', event => {
    if (isUserMarkersEnabled)
      addUserMarker(event)
    onFeatureClick(event)
  })
  map.addListener('click', event => {
    addUserMarker(event)
  })
  map.addListener('zoom_changed', debounceZoomChanged)
  map.addListener('bounds_changed', debounceShowMarkersInBounds)
  map.addListener('center_changed', () => {
    PROPS.GMOnCenterChanged({
      zoom: map.getZoom(),
      center: map.getCenter(),
      bounds: map.getBounds(),
    })
  })
}

const showMarkersInBounds = () => {
  let bounds = map.getBounds()
  if (!bounds)
    return

  featureMarkers.forEach((marker) => {
    if (bounds.contains({ lat: Number(marker.position.lat), lng: Number(marker.position.lng) }))
      marker.setMap(map)
    else
      marker.setMap(null)
  })
  PROPS.GMOnBoundsChanged({
    zoom: map.getZoom(),
    center: map.getCenter(),
    bounds: map.getBounds(),
  })
}

const handleZoomChanged = () => {
  resetZoomGMFeatures()
  PROPS.GMOnZoomChanged({
    zoom: Math.round(map.getZoom()),
    center: map.getCenter(),
    bounds: map.getBounds(),
  })
}

const resetZoomGMFeatures = () => {
  if (!isZoomNavigation.value)
    return

  setZoomFeatures()
}

const setZoomFeatures = () => {
  for (let feature of PROPS.GMFeatures[showZoomFeatures.value])
    feature.properties.show = true

  let zoomNumber = Math.round(map.getZoom())
  if (zoomNumber === showZoomFeatures.value)
    return

  let zoomKeys = Object.keys(PROPS.GMFeatures)
  let lastZoomKey = parseInt(zoomKeys[zoomKeys.length - 1])
  for (let key of zoomKeys) {
    let zoomKey = parseInt(key)
    if (zoomNumber <= zoomKey) {
      showZoomFeatures.value = zoomKey
      break
    }
    if (zoomNumber >= lastZoomKey) {
      showZoomFeatures.value = lastZoomKey
      break
    }
    if (zoomNumber === zoomKey) {
      showZoomFeatures.value = zoomKey
      break
    }
  }
}

const removeMapListeners = () => {
  google.maps.event.clearListeners(map.data, 'click')
  google.maps.event.clearListeners(map, 'click')
  google.maps.event.clearListeners(map, 'zoom_changed')
  google.maps.event.clearListeners(map, 'bounds_changed')
  google.maps.event.clearListeners(map, 'center_changed')
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
  labelDiv.textContent = feature.getProperty(PROPS.GMFeatureLabelKey)
  labelDiv.style.fontSize = '12px'
  labelDiv.style.fontWeight = 'bold'
  labelDiv.style.color = '#ffffff'
  labelDiv.style.textTransform = 'uppercase'
  labelDiv.style.background = feature.getProperty(PROPS.GMFeatureColorKey)
  labelDiv.style.padding = '5px'
  labelDiv.style.borderRadius = '5px'
  labelDiv.style.border = `1px solid ${ feature.getProperty(PROPS.GMFeatureColorKey) }`
  labelDiv.style.boxShadow = `0 3px 4px 2px rgba(0, 0, 0, 0.2)`
  let marker = new AdvancedMarkerElement({
    position: bounds.getCenter(),
    map: map,
    content: labelDiv,
    title: feature.getProperty(PROPS.GMFeatureLabelKey).toString(),
  })
  marker.content.addEventListener('animationend', () => {
    marker.content.style.animation = 'none'
  }, { once: true })
  const aleatoryDropDownTime = (Math.random() * (0.4 - 0.1) + 0.1).toFixed(2)
  marker.content.style.animation = `drop-down ${ aleatoryDropDownTime }s ease-in-out forwards`
  featureMarkers.push(marker)
}

const onMarkerDragEnd = marker => {
  PROPS.GMOnMarker({
    event: 'drag-end',
    marker: marker,
    markers: userMarkers,
  })
}

const onMarkerClick = marker => {
  markerSelected = marker
  PROPS.GMOnMarker({
    event: 'clicked',
    marker: marker,
    markers: userMarkers,
  })
}

const onFeatureClick = event => {
  PROPS.GMFeatureOnClick({
    event: 'clicked',
    feature: event.feature,
  })
}

const addUserMarker = async el => {
  el.stopPropagation()
  if (!isUserMarkersEnabled)
    return

  const {
    AdvancedMarkerElement,
    PinElement,
  } = await importLibrary('marker')
  const pin = new PinElement()
  const aleatoryDropDownTime = (Math.random() * (0.4 - 0.1) + 0.1).toFixed(2)
  pin.element.style.animation = `drop-down ${ aleatoryDropDownTime }s ease-in-out forwards`
  let marker = new AdvancedMarkerElement({
    content: pin.element,
    gmpDraggable: isUserMarkersDraggable,
    map: map,
    position: e.latLng,
  })
  marker.addListener('click', () => onMarkerClick(marker))
  marker.addListener('dragend', () => onMarkerDragEnd(marker))
  userMarkers.push(marker)
  PROPS.GMOnMarker({
    event: 'added',
    marker: marker,
    markers: userMarkers,
  })
}

const setDefaultUIButtons = () => {
  map.controls[google.maps.ControlPosition['BOTTOM_CENTER']] = []
  addCustomUIButtonIcon('center_focus_strong', 'BOTTOM_CENTER', () => setMapCenterByFeatures('setCenter'))
  addCustomUIButtonIcon('strategy', 'BOTTOM_CENTER', toggleFeatureLabels, isFeatureLabelsVisible)
  addCustomUIButtonIcon('globe_location_pin', 'BOTTOM_CENTER', toggleUserMarkers, isUserMarkersVisible)
  addCustomUIButtonIcon('add_location_alt', 'BOTTOM_CENTER', toggleEnableUserMarkers, isUserMarkersEnabled)
  addCustomUIButtonIcon('move', 'BOTTOM_CENTER', toggleUserMarkersDraggable, isUserMarkersDraggable)
  addCustomUIButtonIcon('location_off', 'BOTTOM_CENTER', removeUserMarkers)
  addCustomUIButtonIcon('wrong_location', 'BOTTOM_CENTER', removeUserMarker)
  addCustomUIButtonIcon('filter_center_focus', 'BOTTOM_CENTER', setMapCenterByUserMarkers)
  addCustomUIButtonIcon('route', 'BOTTOM_CENTER', () => generateRoute(userMarkers))
  addCustomUIButtonIcon('layers', 'BOTTOM_CENTER', toggleFeatures, isFeaturesVisible.value)
  addCustomUIButtonIcon('linear_scale', 'BOTTOM_CENTER', toggleZoomNavigation, isZoomNavigation.value)
  addCustomUIButtonIcon('refresh', 'BOTTOM_CENTER', setZoomFeatures)
}

const removeUserMarkers = () => {
  userMarkers.forEach(marker => {
    marker.content.addEventListener('animationend', () => {
      marker.map = null
      marker.content.style.animation = 'none'
    }, { once: true })
    let aleatoryDropDownTime = (Math.random() * (0.4 - 0.1) + 0.1).toFixed(2)
    marker.content.style.animation = `drop-up ${ aleatoryDropDownTime }s ease-in-out forwards`
  })
  userMarkers = []
  PROPS.GMOnMarker({
    event: 'removed-all',
    markers: userMarkers,
  })
}

const removeUserMarker = () => {
  markerSelected.content.addEventListener('animationend', () => {
    markerSelected.map = null
    markerSelected.content.style.animation = 'none'
    userMarkers = userMarkers.filter(m => m !== markerSelected)
    PROPS.GMOnMarker({
      event: 'removed',
      marker: markerSelected,
      markers: userMarkers,
    })
    markerSelected = null
  }, { once: true })
  let aleatoryDropDownTime = (Math.random() * (0.4 - 0.1) + 0.1).toFixed(2)
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
      let aleatoryDropDownTime = (Math.random() * (0.4 - 0.1) + 0.1).toFixed(2)
      marker.content.style.animation = `drop-down ${ aleatoryDropDownTime }s ease-in-out forwards`
    })
    return
  }
  featureMarkers.forEach(marker => {
    marker.content.addEventListener('animationend', () => {
      marker.map = null
      marker.content.style.animation = 'none'
    }, { once: true })
    let aleatoryDropDownTime = (Math.random() * (0.4 - 0.1) + 0.1).toFixed(2)
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
      let aleatoryDropDownTime = (Math.random() * (0.4 - 0.1) + 0.1).toFixed(2)
      marker.content.style.animation = `drop-down ${ aleatoryDropDownTime }s ease-in-out forwards`
    })
    return
  }
  userMarkers.forEach(marker => {
    marker.content.addEventListener('animationend', () => {
      marker.map = null
      marker.content.style.animation = 'none'
    }, { once: true })
    let aleatoryDropDownTime = (Math.random() * (0.4 - 0.1) + 0.1).toFixed(2)
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

const generateRoute = async (markers = []) => {
  let result = {}
  try {
    if (markers.length < 2)
      throw 'no markers'
    const {
      Route,
    } = await importLibrary('routes')
    const firstMarker = markers[0]
    const lastMarker = markers[markers.length - 1]
    const middleMarkers = markers.slice(1, -1)
    let intermediates = []
    for (const marker of middleMarkers)
      intermediates.push({
        lat: Number(marker.position.lat), 
        lng: Number(marker.position.lng),
      })
    const request = {
      origin: {
        lat: Number(firstMarker.position.lat), 
        lng: Number(firstMarker.position.lng),
      },
      destination: {
        lat: Number(lastMarker.position.lat), 
        lng: Number(lastMarker.position.lng),
      },
      intermediates: intermediates,
      travelMode: google.maps.TravelMode.WALKING,
      optimizeWaypointOrder: false,
      fields: [
        'path',
        'distanceMeters',
        'durationMillis',
        'legs',
      ],
    }
    const { routes } = await Route.computeRoutes(request)
    if (!routes || routes.length === 0)
      throw 'no routes'
    const routeResult = routes[0]
    const polylines = routeResult.createPolylines()
    polylines.forEach(polyline => {
      polyline.setMap(map)
      polyline.setOptions({
        strokeColor: '#8055f6',
        strokeOpacity: 1.0,
        strokeWidth: 2,
      })
    })
    result = {
      polylines: polylines,
      totalWaypoints: intermediates.length + 2,
      route: routeResult,
    }
  } catch (err) {
    console.error('== generateRoute ==', err)
  } finally {
    PROPS.GMOnRouteCalculated(result)
  }
}

const toggleFeatures = () => {
  isFeaturesVisible = !isFeaturesVisible
  features.forEach(feature => {
    map.data.overrideStyle(feature, { visible: isFeaturesVisible })
  })
}

const toggleZoomNavigation = el => {
  isZoomNavigation.value = !isZoomNavigation.value
}

const addCustomUIButtonIcon = (iconName, position, callback, isToggle = undefined) => {
  // NOTE: POSITION USE:
  // TOP: TOP_LEFT, TOP_CENTER, TOP_RIGHT
  // LATERALS: LEFT_TOP, RIGHT_TOP, LEFT_CENTER, RIGHT_CENTER
  // BOTTOM: BOTTOM_LEFT, BOTTOM_CENTER, BOTTOM_RIGHT
  const controlDiv = document.createElement('div')
  const controlUI = document.createElement('button')
  const icon = document.createElement('i')
  icon.textContent = iconName
  icon.classList.add('material-symbols-rounded')
  icon.classList.add('icon')
  icon.style.setProperty('pointer-events', 'none')
  controlUI.classList.add('gm-btn-icon')
  if (isToggle === true)
    controlUI.classList.add('active')
  controlUI.appendChild(icon)
  controlDiv.classList.add('gm-btn-wrapper')
  controlDiv.appendChild(controlUI)
  controlUI.addEventListener('click', el => {
    if (isToggle !== undefined)
      el.target.classList.toggle('active')
    callback(el)
  })
  map.controls[google.maps.ControlPosition[position]].push(controlDiv)
}

const addCustomUIButtonText = (text, position, callback) => {
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

// NOTE: DEBOUNCE FUNCTIONS
const debounceZoomChanged = _.debounce(handleZoomChanged, 1000, { 'trailing': true })
const debounceShowMarkersInBounds = _.debounce(showMarkersInBounds, 500, { 'trailing': true })


</script>

<style scoped lang="css">
#box-wrapper {
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  box-shadow: var(--main-box-shadow);
  overflow: hidden;
  position: sticky;
  top: 0;
  transition-duration: 500ms;
}

#map-container {
  position: relative;
  width: 100%;
  height: 600px;
}

.title {
  color: #FFFFFF;
  font-weight: bold;
  left: 10px;
  margin: auto;
  pointer-events: none;
  position: absolute; 
  text-shadow: 0px 5px 20px rgba(0, 0, 0, 1);
  top: 10px;
  z-index: 10;
}

.google-map {
  width: 100%;
  height: 100%;
}

#loader { 
  bottom: 0;
  display: flex;
  left: 0; 
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

#loader > p {
  color: #FFFFFF;
  font-weight: bold;
  margin: auto;
  text-align: center;
  text-shadow: 0px 5px 20px rgba(0, 0, 0, 1);
  text-transform: uppercase;
}

#info-box {
  left: 10px;
  margin: auto;
  position: absolute;
  top: 10px;
  z-index: 10;
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

.gm-btn-wrapper {
  margin: 24px 5px;
  background-color: var(--main-theme-color);
}

.gm-btn-icon {
  background-color: var(--main-box-bg-color);
  border: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  color: var(--main-text-color);
  cursor: pointer;
  padding: 5px 10px;
  position: relative;
}

.gm-btn-icon:hover {
  background-color: var(--main-hover-color);
}

.gm-btn-icon:active {
  background-color: var(--main-active-color);
}

.gm-btn-icon:disabled {
  cursor: not-allowed;
}

.gm-btn-icon.active {
  background-color: var(--main-active-color);
}


</style>