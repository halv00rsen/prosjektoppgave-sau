<template>
  <main-map
    ref="mainmap">
    <div
      v-if="!settings.showDensity">
      <div
        v-for="trip of trips"
        :key="'trip-' + trip.id">

        <div
          v-if="!settings.groupTrips || showObservationOfTrip(trip.boundsTotal)">
          <map-observation
            v-for="(observation, index) of trip.observations"
            :key="'observation-' + trip.id + index"
            :observation="observation"
            :observation-color="trip.color"
            :clickable="false"
            :analysis-view="true"
          />
          <div v-if="settings.showRoute">
            <trail-route
              :positions="trip.positions"
              :color="trip.color"
            />
          </div>
          <l-rectangle
            v-if="settings.showRectangle"
            :fill="false"
            :color="trip.color"
            :bounds="getRectangle(trip.boundsTotal)"
            dash-array="10,7"
          />
        </div>
        <trip-point
          v-else
          :trip="trip"
          :zoom-map="zoomMap"
        />
      </div>
    </div>
    <div
      v-else>
      <v-marker-cluster
        :options="clusterOptions">
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
      <div v-if="settings.showRoute">
        <div
          v-for="trip of trips"
          :key="'trip-trail-' + trip.id">
          <trail-route
            :positions="trip.positions"
            :color="trip.color"
          />
        </div>
      </div>
    </div>
  </main-map>
</template>

<script>
import { LRectangle, } from 'vue2-leaflet';

import MainMap from '@/components/map/MainMap.vue';
import MapObservation from '@/components/MapObservation.vue';
import ClusterObservation from '@/components/map/ClusterObservation.vue';
import Vue2LeafletMarkercluster from '@/components/map/Vue2LeafletMarkercluster.vue';
import MapTrail from '@/components/MapTrail.vue';
import TrailRoute from '@/components/TrailRoute.vue';
import TripPoint from '@/components/map/TripPoint.vue';

export default {
  name: 'AnalysisMap',
  components: {
    MainMap,
    MapObservation,
    ClusterObservation,
    'v-marker-cluster': Vue2LeafletMarkercluster,
    MapTrail,
    TrailRoute,
    TripPoint,
    LRectangle,
  },
  data: () => ({
    clusterOptions: {
      animateAddingMarkers: false,
    },
  }),
  computed: {
    trips() {
      return this.$store.state.analysis.selectedTrips;
    },
    settings() {
      return this.$store.state.analysis.settings;
    },
    localBounds() {
      return this.$refs.mainmap.localBounds;
    },
  },
  methods: {
    showObservationOfTrip(tripBounds) {
      if (!this.localBounds) {
        return true;
      }
      const mapLatVal = Math.abs(
        this.localBounds._northEast.lat - this.localBounds._southWest.lat);
      const mapLngVal = Math.abs(
        this.localBounds._northEast.lng - this.localBounds._southWest.lng);
      const tripLatVal = Math.abs(tripBounds.maxLat - tripBounds.minLat);
      const tripLngVal = Math.abs(tripBounds.maxLng - tripBounds.minLng);
      const factor = 8.5;
      return tripLatVal * factor > mapLatVal && tripLngVal * factor > mapLngVal;
    },
    zoomMap(bounds) {
      return this.$refs.mainmap.zoomMap(bounds);
    },
    getRectangle(bound) {
      return [
        [bound.minLat, bound.minLng],
        [bound.maxLat, bound.maxLng],
      ];
    },
    getStyle(color) {
      return {
        color,
        weight: 2,
      };
    },
  },
};
</script>

<style>

</style>
