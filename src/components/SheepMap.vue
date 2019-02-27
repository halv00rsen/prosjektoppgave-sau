<template>
  <div>
    <md-dialog-confirm
      :md-active.sync="savingActive"
      :md-content="'Det vil her lastes ned ' + numTiles + ' bilder.'"
      md-title="Laste ned markert kart?"
      md-confirm-text="Lagre kartet"
      md-cancel-text="Avbryt"
      @md-cancel="savingActive = false"
      @md-confirm="saveCallback(); savingActive = false; downloading = true;" />

    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      class="l-map"
      style="height: 70vh;"
      @update:zoom="zoomUpdate"
      @update:center="centerUpdated">

      <l-marker
        v-if="marker"
        :lat-lng="marker">
        <l-tooltip>Dette er deg</l-tooltip>
      </l-marker>

      <div v-if="!analysisView && !useDownload && currentTrip">
        <map-observation
          v-for="(observation, index) of currentTrip.observations"
          :key="index"
          :observation="observation"
          :index="index"/>

        <map-trail
          v-for="(pos, index) of currentTrip.positions"
          :key="'trai-' + index"
          :latitude="pos.lat"
          :longitude="pos.lng"/>
      </div>
      <div v-else-if="analysisView">
        <div
          v-for="trip of trips"
          :key="'trip' + trip.id">
          <map-observation
            v-for="(observation, index) of trip.observations"
            :key="index"
            :observation="observation"
            :index="index"
            :clickable="false"/>
        </div>
      </div>
    </l-map>
    <md-progress-bar
      v-if="downloading"
      :md-value="amount"
      md-mode="determinate"/>

    <div
      v-if="positionOn"
      id="centerButton"
      class="leaflet-bar leaflet-control">
      <a @click="changeCenter">
        <font-awesome-icon icon="arrow-alt-circle-up"/>
      </a>
    </div>
    <div style="display: none;">
      <font-awesome-icon
        id="downloadIcon"
        icon="download"/>
      <font-awesome-icon
        id="deleteIcon"
        icon="trash"/>
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
    analysisView: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      zoom: 13,
      center: undefined,
      urls: [
        {
          url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}',
          visual: 'Gråtone',
        },
        {
          url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
          visual: 'Terrengkart',
        },
      ],
      terrain_url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
      attribution: '&copy; <a href="https://www.kartverket.no/">Kartverket</a>',
      currentZoom: 13,
      saveCallback: undefined,
      savingActive: false,
      numTiles: -1,
      downloading: false,
      amount: 0,
    };
  },
  computed: {
    currentTrip() {
      return this.$store.state.trip.activeTrip;
    },
    marker() {
      return this.$store.state.trip.currentPosition;
    },
    positionOn() {
      return this.$store.state.application.positionRetrieved;
    },
    trips() {
      return this.$store.state.analysis.selectedTrips;
    },
  },
  mounted() {
    if (this.marker) {
      this.center = {
        lat: this.marker.lat,
        lng: this.marker.lng,
      };
    } else {
      this.center = {
        lat: 65,
        lng: 18,
      };
      this.zoom = 4;
    }

    this.$nextTick(() => {
      const database = new TileDatabase(this.amountCallback);
      const offlineLayer = L.tileLayer.offline(this.terrain_url, database, {
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
      if (this.positionOn) {
        L.Control.PositionButton = L.Control.extend({
          onAdd() {
            return L.DomUtil.get('centerButton');
          },
          onRemove() {

          },
        });
        L.control.positionButton = (opts) => {
          return new L.Control.PositionButton(opts);
        };
        L.control.positionButton({ position: 'bottomleft', }).addTo(map);
      }
    });
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    changeCenter() {
      this.$refs.map.mapObject.setView(this.marker, 15, { animation: true, });
    },
    amountCallback(amount) {
      this.downloading = true;
      this.amount = amount * 100;
    },
  },
};
</script>

<style>
.l-map {
  z-index: 0;
}
</style>
