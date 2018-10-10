<template>
  <div>
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
          :observerLongitude="observation.observedPosition.lng">
        </map-observation>

        <map-trail
          v-for="(pos, index) of currentTrip.positions"
          :key="(index + 1) * 1000"
          :latitude="pos.lat"
          :longitude="pos.lng">
        </map-trail>
      </div>
    </l-map>
  </div>
</template>

<script>
// import Vue from 'vue';
import L from 'leaflet';
import 'leaflet-offline';
import {
  LMap, LTileLayer, LMarker, LTooltip, LGeoJson,
} from 'vue2-leaflet';

import TileDatabase from '@/database/tiledatabase';
import MapObservation from '@/components/MapObservation.vue';
import MapTrail from '@/components/MapTrail.vue';

function halla(inp, to) {
  console.log(inp + ':' + to);
}

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
    }
  },
  mounted() {
    this.center = {
      lat: this.marker.lat,
      lng: this.marker.lng,
    };

    this.$nextTick(() => {
      const database = new TileDatabase(halla);
      const offlineLayer = L.tileLayer.offline(this.url, database, {
        attribution: this.attribution,
        minZoom: 0,
        maxZoom: 19,
        crossOrigin: true,
      });

      const offlineControl = L.control.offline(offlineLayer, database, {
        saveButtonHtml: 'Lagre',
        removeButtonHtml: 'Slett',
        confirmSavingCallback: function (nTilesToSave, continueSaveTiles) {
          if (window.confirm('Save ' + nTilesToSave + '?')) {
            continueSaveTiles();
          }
        },
        confirmRemovalCallback: function (continueRemoveTiles) {
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
    });
  },
  methods: {
    zoomUpdate (zoom) {
      this.currentZoom = zoom;
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
