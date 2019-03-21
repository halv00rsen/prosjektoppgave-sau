
<template>
  <l-map
    ref="map"
    :zoom.sync="zoom"
    :center="center"
    :options="mapOptions"
    :max-zoom="18"
    :min-zoom="4"
    :style="useMaxSize ? 'height: 79vh' : 'height: 70vh;'"
    @update:center="centerUpdated">

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
    <div
      v-if="!showDensity">
      <div
        v-for="trip of trips"
        :key="'trip-' + trip.id">

        <map-observation
          v-for="(observation, index) of trip.observations"
          :key="index"
          :observation="observation"
          :index="index"
          :observation-color="trip.color"
          :clickable="false"
        />
      </div>
    </div>
    <div
      v-else>
      <v-marker-cluster
        :options="clusterOptions"
        @clusterclick="clickCluster()">
        <div
          v-for="trip of trips"
          :key="'trip-' + trip.id">

          <cluster-observation
            v-for="(observation, index) of trip.observations"
            :key="index"
            :color="trip.color"
            :observation="observation"
          />
        </div>
      </v-marker-cluster>
    </div>

    <div v-if="showRoute">
      <div
        v-for="trip of trips"
        :key="'trip-' + trip.id">

        <trail-route
          v-if="trip.positions.length > 1"
          :positions="trip.positions"
          :color="trip.color"
        />
        <div v-else>
          <map-trail
            v-for="(pos, index) of trip.positions"
            :key="'trip-pos-' + trip.id + '-' + index"
            :latitude="pos.lat"
            :longitude="pos.lng"
            :color="trip.color"/>
        </div>
      </div>
    </div>

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

import MapObservation from '@/components/MapObservation.vue';
import ClusterObservation from '@/components/map/ClusterObservation.vue';
import Vue2LeafletMarkercluster from '@/components/map/Vue2LeafletMarkercluster.vue';
import MapTrail from '@/components/MapTrail.vue';
import TrailRoute from '@/components/TrailRoute.vue';

export default {
  name: 'MainMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LGeoJson,
    LControlLayers,
    MapObservation,
    ClusterObservation,
    'v-marker-cluster': Vue2LeafletMarkercluster,
    MapTrail,
    TrailRoute,
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
    clusterOptions: {
      animateAddingMarkers: false,
    },
    mapOptions: {},
  }),
  computed: {
    trips() {
      return this.$store.state.analysis.selectedTrips;
    },
    bounds() {
      if (!this.$store.state.analysis.minLat) {
        return undefined;
      }
      return [
        [
          this.$store.state.analysis.minLat,
          this.$store.state.analysis.minLng,
        ], [
          this.$store.state.analysis.maxLat,
          this.$store.state.analysis.maxLng,
        ]
      ];
    },
    automaticZoom() {
      return this.$store.state.analysis.settings.automaticZoom;
    },
    showDensity() {
      return this.$store.state.analysis.settings.showDensity;
    },
    showRoute() {
      return this.$store.state.analysis.settings.showRoute;
    },
    useMaxSize() {
      return this.$store.state.analysis.selectedCase.fixedTrips;
    },
  },
  watch: {
    bounds() {
      if (this.automaticZoom) {
        this.zoomMap();
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
    });
  },
  methods: {
    zoomMap() {
      if (this.bounds) {
        this.$refs.map.mapObject.fitBounds(this.bounds);
      }
    },
    centerUpdated(center) {
      this.center = center;
    },
    clickCluster() {
      console.log('cluster');
    },
  },
};
</script>

<style>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
</style>
