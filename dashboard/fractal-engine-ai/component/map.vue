<template lang="html">
  <div v-if="show">
    <label id="title">
      {{ $t(title) }}
      - ({{ model.get(this.propName).length }})
    </label>
    <div id="input-url-wrapper">
      <InputText
        inputName="google maps url"
        v-bind:inputValue="googleMapURL"
        v-bind:onChangeValue="onChangeInputValue"
        propName="google_map_url"
        v-bind:errorMessage="googleMapURLError"
        helperMessage="usa la url de google maps"/>
      <div
        id="set-mark">
        <template
          v-if="!googleMapURLError && googleMapURL !== ''">
          <ButtonIcon
            buttonText="refresh"
            buttonIcon="where_to_vote"
            v-bind:buttonAction="googleMapSetMarker"/>
        </template>
      </div>
    </div>
    <div id="map">
    </div>
    <label
      v-if="errorMessage"
      id="error-message">
      {{ $t(errorMessage) }}
    </label>
    <label
      v-if="!errorMessage"
      id="helper-message">
      {{ $t(helperMessage) }}
    </label>
  </div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader"
import InputText from './input-text.vue'
import ButtonIcon from './button-icon.vue'

const GOOGLE_MAP_URL_REG = /@\-*[0-9\.]+,\-*[0-9\.]+/g

// NOTE: propName value = [{lat:19.7297278,lng:-101.1730622},{lat:20.7297278,lng:-100.1730622},{lat:18.7297278,lng:-102.1730622}]
export default {
  props: [
    'show',
    'title',
    'helperMessage',
    'errorMessage',
    'model',
    'propName',
  ],
  components: {
    InputText,
    ButtonIcon,
  },
  data () {
    return {
      Map: null,
      apiKey: 'AIzaSyCBcFTQZtdnebNmASuYjvGLVX0fViq6eq4',
      loader: null,
      map: null,
      mapMarkers: [],
      markerInfoWindow: null,
      throttleSetModelMarkers: _.debounce(this.setModelMarkers, 1000, { 'trailing': true }),
      throttleInitMap: _.debounce(this.initMap, 500, { 'trailing': true }),
      googleMapURL: '',
      googleMapURLError: '',
      googleMapLatLng: [],
    }
  },
  async created () {
    this.loader = new Loader({
      apiKey: this.apiKey,
    })
    await this.loader.load()
    let {
      Map
    } = await google.maps.importLibrary('maps')
    this.Map = Map
    window.onClickInfoWindow = index => {
      this.markerRemove(index)
    }
    this.model.on('notification', event => {
      if (event.method === 'put')
        this.mapClearMarkers()
    })
  },
  watch: {
    show (newVal, oldVal) {
      if (this.show) {
        this.throttleInitMap()
        return
      }
      if (!this.show) {
        this.model.set(this.propName, [])
        this.mapClearMarkers()
      }
    },
  },
  mounted () {
    if (this.show)
      this.throttleInitMap()
  },
  methods: {
    mapClearMarkers () {
      for (let m of this.mapMarkers)
        m.setMap(null)
      this.mapMarkers = []
      this.parseMarkers()
    },
    async initMap () {
      // NOTE: INIT MAP
      let el = document.getElementById('map')
      if (el === null)
        return

      this.map = new this.Map(el, {
        center: {
          lat: 19.7297278,
          lng: -101.1730622,
        },
        zoom: 6,
        gestureHandling: 'cooperative',
        mapTypeId: 'roadmap',
        mapTypeControlOptions: {
          mapTypeIds: ['roadmap'],
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        },
      })
      this.mapOnClickEvent()
      if (this.model.get(this.propName).length)
        this.parseMarkers()
    },
    parseMarkers () {
      for (let m of this.model.get(this.propName))
        this.markerAdd({
          lat: m.lat,
          lng: m.lng,
        })
      if (this.model.get(this.propName).length)
        this.mapSetFitBounds()
    },
    mapOnClickEvent () {
      this.map.addListener('click', mapsMouseEvent => {
        let clickLat = mapsMouseEvent.latLng.lat()
        let clickLng = mapsMouseEvent.latLng.lng()
        this.markerAdd({
          lat: clickLat,
          lng: clickLng,
        })
      })
    },
    markerAdd (positionLatLng) {
      if (this.mapMarkers.length >= this.model.get('wall_total'))
        return

      let marker = new google.maps.Marker({
        position: positionLatLng,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: 'click para hacer zoom',
        map: this.map,
        index: this.mapMarkers.length,
      })
      this.markerOnClickEvent(marker)
      this.markerOnDragEndEvent(marker)
      this.mapMarkers.push(marker)
      this.setModelMarkers()
    },
    markerRemove (index) {
      let removeIndex = -1
      for (let i in this.mapMarkers) {
        let m = this.mapMarkers[i]
        if (m.index === index) {
          removeIndex = i
          break
        }
      }
      this.mapMarkers[removeIndex].setMap(null)
      this.mapMarkers.splice(removeIndex, 1)
      this.setModelMarkers()
    },
    markerOnClickEvent (marker) {
      marker.addListener('click', () => {
        this.markerMakeInfoWindow(marker.index)
        this.markerInfoWindow.open({
          anchor: marker,
          map: this.map,
        })
      })
    },
    markerOnDragEndEvent (marker) {
      marker.addListener('drag', () => {
        this.throttleSetModelMarkers()
      })
    },
    markerMakeInfoWindow (index) {
      this.markerInfoWindow = new google.maps.InfoWindow({
        content: `<button style="font-size=12px; font-weight=bold; color: var(--main-accent-color); border: 0; background-color: var(--main-active-color);" onclick="window.onClickInfoWindow(${ index })">ELIMINAR</button>`,
        maxWidth: 200,
      })
    },
    setModelMarkers () {
      let markers = []
      for (let m of this.mapMarkers)
        markers.push({
          lat: m.position.lat(),
          lng: m.position.lng(),
        })
      this.model.set(this.propName, markers)
    },
    mapSetFitBounds () {
      if (!this.mapMarkers.length)
        return

      let bounds = new google.maps.LatLngBounds()
      for (let m of this.mapMarkers)
        bounds.extend(m.getPosition())
      this.map.fitBounds(bounds)
    },
    onChangeInputValue (propName, value) {
      this.googleMapURL = value
      this.googleMapURLError = ''
      let matches = this.googleMapURL.match(GOOGLE_MAP_URL_REG)
      if (matches !== null && matches.length) {
        this.googleMapLatLng = matches[0].split(',')
        return
      }
      this.googleMapURLError = 'url invalida'
    },
    googleMapSetMarker () {
      this.googleMapURL = ''
      this.googleMapURLError = ''
      this.googleMapLatLng[0] = this.googleMapLatLng[0].replace('@', '')
      this.markerAdd({
        lat: parseFloat(this.googleMapLatLng[0]),
        lng: parseFloat(this.googleMapLatLng[1]),
      })
    },
  },
}
</script>

<style scoped lang="css">

#map {
  height: 240px;
  width: 100%;
}

#title {
  color: var(--main-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding: 0 10px;
  text-transform: uppercase;
}

#error-message,
#helper-message {
  color: var(--main-secondary-text-color);
  font-size: var(--main-secundary-font-size);
  font-weight: 600;
  padding-left: 10px;
  position: relative;
  text-transform: uppercase;
}

#error-message {
  color: var(--main-color-error);
}

#helper-message {
  color: var(--main-secondary-text-color);
}


#input-url-wrapper {
  display: flex;
  gap: 6px;
}

#set-mark {
  align-self: center;
}

</style>
