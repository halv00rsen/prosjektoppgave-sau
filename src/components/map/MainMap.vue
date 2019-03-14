
<template>
  <l-map
    ref="map"
    :zoom.sync="zoom"
    :center="center"
    :options="mapOptions"
    :max-zoom="18"
    :min-zoom="4"
    style="height: 70vh;"
    @update:center="centerUpdated">
    <l-control-layers
      :collapsed="false"
      :sort-layers="true"
      position="topright"
    />
    <l-tile-layer
      v-for="url in urls"
      :key="url.visual"
      :name="url.visual"
      :visible="true"
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

        <map-trail
          v-for="(pos, index) of trip.positions"
          :key="'trip-pos-' + trip.id + '-' + index"
          :latitude="pos.lat"
          :longitude="pos.lng"
          :color="trip.color"/>
      </div>
    </div>
  </l-map>
</template>

<script>
import {
  LMap, LTileLayer, LMarker, LTooltip, LGeoJson, LControlLayers,
} from 'vue2-leaflet';

import MapObservation from '@/components/MapObservation.vue';
import ClusterObservation from '@/components/map/ClusterObservation.vue';
import Vue2LeafletMarkercluster from '@/components/map/Vue2LeafletMarkercluster.vue';
import MapTrail from '@/components/MapTrail.vue';

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
  },
  data: () => ({
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
  },
  watch: {
    bounds() {
      if (this.automaticZoom) {
        this.zoomMap();
      }
    },

  },
  methods: {
    zoomMap() {
      this.$refs.map.mapObject.fitBounds(this.bounds);
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
