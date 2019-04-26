
<template>
  <main-map
    ref="mainmap">
    <div
      v-for="trip of trips"
      :key="'trip-' + trip.id">

      <div v-if="settings.showRoute">
        <div v-if="!settings.groupTrips || showObservationOfTrip(trip.boundsTotal)">
          <trail-route
            :positions="trip.positions"
            :color="trip.color"
          />
        </div>
        <trip-point
          v-else
          :trip="trip"
          :zoom-map="zoomMap"
        />
      </div>

      <l-rectangle
        v-if="settings.showRectangle"
        :fill="false"
        :color="trip.color"
        :bounds="getRectangle(trip.boundsTotal)"
        dash-array="10,7"
      />

      <div v-if="!settings.showDensity && !settings.showHeatmap">
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
        </div>
      </div>

    </div>

    <div v-if="nibioData !== undefined && settings.showNibio">
      <nibio
        v-for="(elem, index) of nibioData"
        :key="'nibio-' + index"
        :data="elem"
      />
    </div>

    <heatmap
      v-if="settings.showHeatmap"
      :lat-lngs="observations"
      :max="maxNumber"
    />

    <div v-if="settings.showDensity">
      <v-marker-cluster
        :options="clusterOptions">
        <div
          v-for="trip of trips"
          :key="'trip-cluster-' + trip.id">
          <cluster-observation
            v-for="(observation, index) of trip.observations"
            :key="index"
            :color="trip.color"
            :observation="observation"
          />
        </div>
      </v-marker-cluster>
    </div>
  </main-map>
</template>

<script>
import { LRectangle, } from 'vue2-leaflet';
import { mapState, } from 'vuex';

import MainMap from '@/components/map/MainMap.vue';
import MapObservation from '@/components/MapObservation.vue';
import ClusterObservation from '@/components/map/ClusterObservation.vue';
import Vue2LeafletMarkercluster from '@/components/map/Vue2LeafletMarkercluster.vue';
import MapTrail from '@/components/MapTrail.vue';
import TrailRoute from '@/components/TrailRoute.vue';
import TripPoint from '@/components/map/TripPoint.vue';
import Nibio from '@/components/map/Nibio.vue';
import Heatmap from '@/components/map/Heatmap.vue';

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
    Nibio,
    Heatmap,
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
    localBounds() {
      return this.$refs.mainmap.localBounds;
    },
    ...mapState('analysis', [
      'nibioData',
      'settings',
    ]),
    maxNumber() {
      let maxNumber = 0;
      for (let trip of this.trips) {
        for (let observation of trip.observations) {
          if (observation.isSheep && this.settings.showObservations) {
            maxNumber = Math.max(maxNumber, observation.numSheep);
          } else if (!observation.isSheep && this.settings.showPredators) {
            maxNumber = Math.max(maxNumber, observation.numAnimals);
          }
        }
      }
      return maxNumber;
    },
    observations() {
      return this.trips.flatMap((trip) => {
        return trip.observations.map((observation) => {
          const data = {
            lat: observation.position.lat,
            lng: observation.position.lng,
            radius: 25,
          };
          if (observation.isSheep && this.settings.showObservations) {
            return {
              ...data,
              count: observation.numSheep,
            };
          } else if (!observation.isSheep && this.settings.showPredators) {
            return {
              ...data,
              count: observation.numAnimals,
            };
          }
        }).filter((observation) => {
          return observation !== undefined;
        });
      });
    },
    // routes() {
    //   return
    // },
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
    getGeoJSON() {
      const collection = {
        type: 'FeatureCollection',
        features: [],
      };
      this.$refs.mainmap.map.eachLayer((layer) => {
        if (layer.toGeoJSON) {
          const json = layer.toGeoJSON();
          collection.features.push(json);
          if (layer.properties) {
            json.properties = layer.properties;
          }
        }
      });
      return collection;
    },
  },
};
</script>

<style>

</style>
