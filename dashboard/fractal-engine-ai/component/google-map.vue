<template>
  <div
    id="box-wrapper">
    <div class="map-container">
      <div
        ref="mapRef"
        class="google-map">
      </div>
      <div
        v-if="loading"
        class="loader">
          loading...
      </div>
    </div>
  </div>
</template>

<script setup>
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


setOptions({ key: 'AIzaSyB4KbCGbEFrsYLxaAxORNNJVq_ob1Or7fY' })


const INSTANCE = getCurrentInstance()
const GLOBAL = INSTANCE.appContext.config.globalProperties

const props = defineProps({
  GMFeatures: Array, // NOTE: 1- GEOJSON_MUNICIPIO, 2- GEOJSON_DISTRITO_FEDERAL, 3- GEOJSON_DISTRITO_LOCAL, 4- GEOJSON_SECCION
  GMOnClick: Function,
})

const mapRef = ref(null)
const loading = ref(false)
let map = null
let markers = []


watch(() => props.GMFeatures, newData => {
  loadGeoJSON({
    features: props.GMFeatures,
    type: 'FeatureCollection'
  })
})


onMounted (async () => {
  const { Map } = await importLibrary('maps')
  map = new Map(mapRef.value, {
    center: { lat: 19.4326, lng: -99.1332 },
    zoom: 10,
    mapId: 'DEMO_MAP_ID', // Requerido para 3D y estilos avanzados
  })
  loadGeoJSON({
    features: props.GMFeatures,
    type: 'FeatureCollection'
  })
  //setTimeout(() => {
  //  console.log('== GMFeatures ==', props.GMFeatures)
  //  loadGeoJSON({
  //    features: props.GMFeatures,
  //    type: 'FeatureCollection'
  //  })
  //}, 5000)
  //setTimeout(() => {
  //  loadGeoJSON(GEOJSON_DISTRITO_FEDERAL)
  //}, 10000)
  //setTimeout(() => {
  //  loadGeoJSON(GEOJSON_DISTRITO_LOCAL)
  //}, 15000)
  //setTimeout(() => {
  //  loadGeoJSON(GEOJSON_SECCION)
  //}, 20000)
})

const loadGeoJSON = async (geoJSON) => {
  if (!map || !geoJSON)
    return

  loading.value = true
  map.data.forEach((feature) => {
    map.data.remove(feature)
  })
  try {
    const features = map.data.addGeoJson(geoJSON)
    const bounds = new google.maps.LatLngBounds()
    features.forEach(feature => {
      processConfiguration(feature.getGeometry(), bounds.extend, bounds)
      setMarker(feature)
    })
    map.fitBounds(bounds)
    removeEvents()
    setEvents()
    setStyles()
    console.log(`${features.length} elements added to map`)
  } catch (err) {
    console.error('== loadGeoJSON ==', err)
  } finally {
    loading.value = false
  }
}

const setMarker = feature => {
  let bounds = new google.maps.LatLngBounds()
  feature.getGeometry().forEachLatLng((latlng) => {
    bounds.extend(latlng);
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
  markers.push(marker)
}

const showMarker = isVisible => {
  markers.forEach(marker => {
    marker.setVisible(isVisible)
  })
}

const processConfiguration = (geometry, callback, thisArg) => {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry)
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get())
  } else {
    geometry.getArray().forEach(g => {
      processConfiguration(g, callback, thisArg)
    })
  }
}

const setStyles = () => {
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

const setEvents = () => {
  map.data.addListener('click', props.GMOnClick)
}

const removeEvents = () => {
  google.maps.event.clearListeners(map.data, 'click')
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
