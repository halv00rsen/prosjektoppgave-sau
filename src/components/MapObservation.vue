<template>
  <div>
    <l-geo-json
      v-if="showObservedPoints"
      :geojson="geojson"/>

    <l-circle-marker
      :lat-lng="observed"
      :radius="10"
      :color="observationColor"
      :fill="!observation.isSheep"
      :fill-opacity="1"
      fill-color="gray"
      @click="openObservation">
      <l-popup>
        <div v-if="observation.isSheep">
          <div v-if="observation.numSheep">
            Antall sau: {{ observation.numSheep }}
          </div>
          <div v-if="observation.numLambs">
            Antall lam: {{ observation.numLambs }}
          </div>
        </div>
        <div v-else>
          {{ observation.animal }}
        </div>
      </l-popup>
    </l-circle-marker>

    <l-circle-marker
      v-if="showObservedPoints"
      :lat-lng="lookout"
      :radius="10"
      color="red"
    />

    <registration
      v-if="open"
      :close="close"
      :edit-callback="editCurrent"
      :delete-callback="deleteObservation"
      :old-object="observation"
      :detailed="observation.detailed"/>
  </div>
</template>

<script>
import {
  LGeoJson, LCircleMarker, LPopup,
} from 'vue2-leaflet';
import Registration from '@/components/Registration.vue';

export default {
  name: 'MapObservation',
  components: {
    LGeoJson,
    LCircleMarker,
    Registration,
    LPopup,
  },
  props: {
    observation: {
      type: Object,
      required: true,
    },
    mock: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: undefined,
    },
    clickable: {
      type: Boolean,
      default: true,
    },
    observationColor: {
      type: String,
      default: 'yellow',
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
  computed: {
    showObservedPoints() {
      return this.$store.state.analysis.settings.showObservedPoints;
    },
  },
  methods: {
    openObservation() {
      if (this.clickable) {
        this.open = true;
      }
    },
    close() {
      this.open = false;
    },
    editCurrent(data) {
      if (this.mock) {
        return;
      }
      this.$store.dispatch('trip/editObservation', { data, index: this.index, }).then(() => {
        this.close();
        this.$store.dispatch('application/setMessage', 'Observasjonen ble endret');
      });
    },
    deleteObservation() {
      if (this.mock) {
        return;
      }
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
