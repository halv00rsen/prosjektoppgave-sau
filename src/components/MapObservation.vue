<template>
  <div>
    <l-geo-json
      :geojson="geojson"
      :options="options"
      @click="openObservation"/>

    <registration
      v-if="open"
      :close="close"
      :edit-callback="editCurrent"
      :delete-callback="deleteObservation"
      :old-object="observation"/>
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
    observation: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
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
                [this.observation.position.lng, this.observation.position.lat],
                [this.observation.observedPosition.lng, this.observation.observedPosition.lat],
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
              coordinates: [this.observation.position.lng, this.observation.position.lat],
            },
          },
          {
            type: 'Feature',
            properties: {
              color: '#ff0000',
            },
            geometry: {
              type: 'Point',
              coordinates: [this.observation.observedPosition.lng, this.observation.observedPosition.lat],
            },
          },
        ],
      },
    };
  },
  methods: {
    openObservation() {
      this.open = true;
    },
    close() {
      this.open = false;
    },
    editCurrent(data) {
      this.$store.dispatch('trip/editObservation', { data, index: this.index, }).then(() => {
        this.close();
        this.$store.dispatch('application/setMessage', 'Observasjonen ble endret');
      });
    },
    deleteObservation() {
      this.$store.dispatch('trip/deleteObservation', this.index).then(() => {
        this.close();
        this.$store.dispatch('application/setMessage', 'Observasjonen ble fjernet');
      });
    },
  },
};
</script>

<style>

</style>
