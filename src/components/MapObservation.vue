<template>
  <div>
  <l-geo-json
    @click="openObservation"
    :geojson="geojson"
    :options="options">
  </l-geo-json>
  <registration
    v-if="open"
    :close="close"
    :oldObject="observation"/>
  </div>
</template>

<script>
import L from 'leaflet';
import {
  LGeoJson,
} from 'vue2-leaflet';
import Registration from '@/components/Registration.vue';

export default {
  name: 'MapObservation',
  components: {
    LGeoJson,
    Registration,
  },
  props: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    observerLatitude: {
      type: Number,
      required: true,
    },
    observerLongitude: {
      type: Number,
      required: true,
    },
    observation: {
      type: Object,
      required: true,
    },
  },
  methods: {
    openObservation() {
      this.open = true;
    },
    close() {
      this.open = false;
    },
  },
  data() {
    return {
      open: false,
      options: {
        pointToLayer: function (feature, latlng) {
          const fillColor = feature.properties.color;
          return L.circleMarker(latlng, {
            radius: 10,
            fillColor,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        },
      },
      geojson: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              color: '#00ff00',
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [this.longitude, this.latitude],
                [this.observerLongitude, this.observerLatitude],
              ],
            },
          },
          {
            type: 'Feature',
            properties: {
              color: '#ffcc00',
            },
            geometry: {
              type: 'Point',
              coordinates: [this.longitude, this.latitude],
            },
          },
          {
            type: 'Feature',
            properties: {
              color: '#ff0000',
            },
            geometry: {
              type: 'Point',
              coordinates: [this.observerLongitude, this.observerLatitude],
            },
          },
        ],
      },
    }
  },
}
</script>

<style>

</style>
