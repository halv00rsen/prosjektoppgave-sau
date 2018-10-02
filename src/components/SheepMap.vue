<template>
  <div>
    <div style="height: 20%; overflow: auto;">
      <h3>Simple map</h3>
      <p v-if="marker">Marker is placed at {{ marker.lat }}, {{ marker.lng }}</p>
      <p> Center is at {{ center }} and the zoom is: {{ currentZoom }} </p>
      <font-awesome-icon icon="coffee"/>
    </div>
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      style="height: 500px"
      @update:zoom="zoomUpdate">
      <l-marker v-if="marker" :lat-lng="marker">
        <l-tooltip>Dette er deg</l-tooltip>
      </l-marker>
      <l-marker v-if="center" :lat-lng="center">
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet-offline';
import {
  LMap, LTileLayer, LMarker, LTooltip,
} from 'vue2-leaflet';

import TileDatabase from '@/database/tiledatabase';

function halla(inp, to) {
  console.log(inp + ':' + to);
}

export default {
  name: 'SheepMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
  },
  props: {

  },
  data () {
    return {
      zoom: 13,
      center: L.latLng(47.413220, -1.219482),
      url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
      attribution: '&copy; <a href="https://www.kartverket.no/">Kartverket</a>',
      marker: undefined,
      currentZoom: 13,
      currentCenter: L.latLng(47.413220, -1.219482),
      counter: 1,
    }
  },
  mounted() {
    this.$nextTick(() => {
      const database = new TileDatabase(halla);
      const offlineLayer = L.tileLayer.offline(this.url, database, {
        attribution: this.attribution,
        minZoom: 13,
        maxZoom: 19,
        crossOrigin: true,
      });

      const offlineControl = L.control.offline(offlineLayer, database, {
        saveButtonHtml: '<font-awesome-icon icon="coffee"/>',
        removeButtonHtml: '<i class="fa fa-trash" aria-hidden="true"></i>',
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
      offlineControl.addTo(map);
    });

    this.$getLocation({
      enableHighAccuracy: true,
    }).then(coordinates => {
      this.counter++;
      // console.log('Counter: ' + this.counter);
      this.center = {
        lat: coordinates.lat,
        lng: coordinates.lng,
      };
      this.marker = coordinates;
    });
  },
  methods: {
    zoomUpdate (zoom) {
      // console.log('zoom');
      this.currentZoom = zoom;
    },
  },
}
</script>
