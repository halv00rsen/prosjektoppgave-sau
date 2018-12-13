<template>
  <div>
    <l-geo-json
      :geojson="geojson"/>

    <l-circle-marker
      :lat-lng="observed"
      :radius="10"
      color="yellow"
      @click="openObservation"
    />

    <l-circle-marker
      :lat-lng="lookout"
      :radius="10"
      color="red"
    />

    <registration
      v-if="open"
      :close="close"
      :edit-callback="editCurrent"
      :delete-callback="deleteObservation"
      :old-object="observation"/>
  </div>
</template>

<script>
import {
  LGeoJson, LCircleMarker,
} from 'vue2-leaflet';
import Registration from '@/components/Registration.vue';

export default {
  name: 'MapObservation',
  components: {
    LGeoJson,
    LCircleMarker,
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
      observed: [this.observation.position.lat, this.observation.position.lng],
      lookout: [this.observation.observedPosition.lat, this.observation.observedPosition.lng],
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
