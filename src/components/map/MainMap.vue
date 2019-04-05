
<template>
  <l-map
    ref="map"
    :zoom.sync="zoom"
    :bounds.sync="localBounds"
    :center="center"
    :options="mapOptions"
    :max-zoom="18"
    :min-zoom="4"
    :style="useMaxSize ? 'height: 79vh' : 'height: 70vh;'"
    @update:center="centerUpdated"
    @click="_clickMap($event)">

    <l-control-scale
      :imperial="false"
      position="bottomleft"
    />
    <l-control-layers
      :collapsed="false"
      :sort-layers="true"
      position="topright"
    />
    <l-tile-layer
      v-for="url in urls"
      :key="url.visual"
      :name="url.visual"
      :visible="url.visible"
      :url="url.url"
      :attribution="attribution"
      layer-type="base"
    />

    <slot/>

    <div
      id="fitZoomButton"
      class="leaflet-bar leaflet-control">
      <a @click="zoomMap()">
        <md-icon>zoom_out_map</md-icon>
      </a>
    </div>
  </l-map>
</template>

<script>
import {
  LMap, LTileLayer, LMarker, LTooltip, LGeoJson, LControlLayers,
  LControlScale,
} from 'vue2-leaflet';
import L from 'leaflet';

import { mapState, mapActions, mapGetters, } from 'vuex';

export default {
  name: 'MainMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LGeoJson,
    LControlLayers,
    LControlScale,
  },
  data: () => ({
    urls: [
      {
        url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}',
        visual: 'Gråtone',
        visible: true,
      },
      {
        url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
        visual: 'Terrengkart',
        visible: false,
      },
    ],
    zoom: 4,
    center: {
      lat: 65,
      lng: 18,
    },
    attribution: '&copy; <a href="https://www.kartverket.no/">Kartverket</a>',
    mapOptions: {
      minZoom: undefined,
      maxBounds: undefined,
    },
    localBounds: undefined,
  }),
  computed: {
    useMaxSize() {
      return this.$store.state.analysis.selectedCase.fixedTrips;
    },
    ...mapState('analysis', [
      'settings',
      'fitBounds',
    ]),
    ...mapGetters('analysis', {
      bounds: 'getBounds',
    }),
  },
  watch: {
    bounds() {
      if (this.settings.automaticZoom) {
        this.zoomMap();
      }
    },
    localBounds() {
      this.$emit('update:bounds', this.localBounds);
    },
    fitBounds() {
      if (this.fitBounds !== undefined) {
        this.zoomMap(this.fitBounds);
        this.resetBounds(undefined);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      const map = this.$refs.map.mapObject;
      L.Control.ZoomButton = L.Control.extend({
        onAdd() {
          return L.DomUtil.get('fitZoomButton');
        },
      });
      L.control.zoomButton = (opts) => {
        return new L.Control.ZoomButton(opts);
      };
      L.control.zoomButton({ position: 'bottomright', }).addTo(map);
      if (this.settings.lockZoom) {
        // this.mapOptions.maxBounds = L.latLngBounds(
        //   L.latLng(this.bounds[0][0], this.bounds[0][1]),
        //   L.latLng(this.bounds[1][0], this.bounds[1][1]),
        // );
        this.mapOptions.minZoom = map.getBoundsZoom(this.bounds);
      }
    });
  },
  methods: {
    zoomMap(bounds) {
      if (bounds) {
        this.$refs.map.mapObject.fitBounds(bounds);
      } else if (this.bounds) {
        this.$refs.map.mapObject.fitBounds(this.bounds);
      }
    },
    centerUpdated(center) {
      this.center = center;
    },
    _clickMap(event) {
      this.$emit('clickMap', event);
    },
    ...mapActions('analysis', {
      resetBounds: 'setFitBounds',
    }),
  },
};
</script>

<style>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
</style>
