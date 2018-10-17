<template>
  <div>
    <md-dialog-confirm
      :md-active.sync="savingActive"
      md-title="Laste ned markert kart?"
      :md-content="'Det vil her lastes ned ' + numTiles + ' bilder.'"
      md-confirm-text="Lagre kartet"
      md-cancel-text="Avbryt"
      @md-cancel="savingActive = false"
      @md-confirm="saveCallback(); savingActive = false; downloading = true;" />

    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      style="height: 50vh;"
      @update:zoom="zoomUpdate">

      <l-marker v-if="marker" :lat-lng="marker">
        <l-tooltip>Dette er deg</l-tooltip>
      </l-marker>

      <div v-if="!useDownload">
        <map-observation
          v-for="(observation, index) of currentTrip.observations"
          :key="index"
          :latitude="observation.position.lat"
          :longitude="observation.position.lng"
          :observerLatitude="observation.observedPosition.lat"
          :observerLongitude="observation.observedPosition.lng"
          :observation="observation">
        </map-observation>

        <map-trail
          v-for="(pos, index) of currentTrip.positions"
          :key="'trai-' + index"
          :latitude="pos.lat"
          :longitude="pos.lng">
        </map-trail>
      </div>
    </l-map>
    <md-progress-bar v-if="downloading" md-mode="determinate" :md-value="amount">

    </md-progress-bar>
    <div id="centerButton" class="leaflet-bar leaflet-control">
      <a @click="changeCenter">
        <font-awesome-icon icon="arrow-alt-circle-up"/>
      </a>
    </div>
    <div style="display: none;">
      <font-awesome-icon id="downloadIcon" icon="download"/>
      <font-awesome-icon id="deleteIcon" icon="trash"/>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue';
import L from 'leaflet';
import 'leaflet-offline';
import {
  LMap, LTileLayer, LMarker, LTooltip, LGeoJson, LControlAttribution,
} from 'vue2-leaflet';

import TileDatabase from '@/database/tiledatabase';
import MapObservation from '@/components/MapObservation.vue';
import MapTrail from '@/components/MapTrail.vue';

// function onEachFeature (feature, layer) {
//   let PopupCont = Vue.extend(PopupContent);
//   let popup = new PopupCont({ propsData: { type: feature.geometry.type, text: feature.properties.popupContent } });
//   layer.bindPopup(popup.$mount().$el);
// }

export default {
  name: 'SheepMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LGeoJson,
    MapObservation,
    MapTrail,
    LControlAttribution,
  },
  props: {
    useDownload: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      zoom: 13,
      center: undefined,
      url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
      attribution: '&copy; <a href="https://www.kartverket.no/">Kartverket</a>',
      currentZoom: 13,
      saveCallback: undefined,
      savingActive: false,
      numTiles: -1,
      downloading: false,
      amount: 0,
    }
  },
  mounted() {
    if (this.marker) {
      this.center = {
        lat: this.marker.lat,
        lng: this.marker.lng,
      };
    }

    this.$nextTick(() => {
      const database = new TileDatabase(this.amountCallback);
      const offlineLayer = L.tileLayer.offline(this.url, database, {
        attribution: this.attribution,
        minZoom: 0,
        maxZoom: 19,
        crossOrigin: true,
      });

      const self = this;
      const offlineControl = L.control.offline(offlineLayer, database, {
        saveButtonHtml: L.DomUtil.get('downloadIcon').outerHTML,
        removeButtonHtml: L.DomUtil.get('deleteIcon').outerHTML,
        saveButtonTitle: 'Lagre kart',
        removeButtonTitle: 'Slett kart',
        confirmSavingCallback(numTiles, saveTiles) {
          self.saveCallback = saveTiles;
          self.numTiles = numTiles;
          self.savingActive = true;
        },
        confirmRemovalCallback(continueRemoveTiles) {
          if (window.confirm('Remove all the tiles?')) {
            continueRemoveTiles();
          }
        },
        minZoom: 13,
        maxZoom: 19,
      });
      const map = this.$refs.map.mapObject;
      offlineLayer.addTo(map);
      if (this.useDownload) {
        offlineControl.addTo(map);
      }
      offlineLayer.on('offline:save-end', () => {
        setTimeout(() => {
          this.downloading = false;
          this.amount = 0;
        }, 1000);
      });
      offlineLayer.on('offline:save-error', function (err) {
        console.error('Error when saving tiles: ' + err);
      });
      L.Control.PositionButton = L.Control.extend({
        onAdd(map) {
          return L.DomUtil.get('centerButton');
        },
        onRemove(map) {

        },
      });
      L.control.positionButton = (opts) => {
        return new L.Control.PositionButton(opts);
      }
      L.control.positionButton({ position: 'bottomleft', }).addTo(map);
    });
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    changeCenter() {
      this.$refs.map.mapObject.setView(this.marker, 15, { animation: true, });
    },
    amountCallback(amount) {
      this.downloading = true;
      this.amount = amount * 100;
    },
  },
  computed: {
    currentTrip() {
      return this.$store.state.trip.activeTrip;
    },
    marker() {
      return this.$store.state.trip.currentPosition;
    },
  },
}
</script>
