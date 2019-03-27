<template>
  <div v-if="showObservation">
    <l-geo-json
      v-if="showObservedPoints"
      :geojson="geojson"
    />

    <l-circle-marker
      :lat-lng="observed"
      :radius="10"
      :color="observationColor"
      :fill="true"
      :fill-opacity="1"
      :fill-color="observation.isSheep ? 'white' : 'gray'"
      pane="shadowPane"
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
          <div>Dyr: {{ observation.animal }}</div>
          <div>Antall: {{ observation.numAnimals }}</div>
        </div>
      </l-popup>
      <l-tooltip
        v-if="showNumInPoint"
        :options="tooltipOptions">
        <div v-if="observation.isSheep">
          {{ observation.numSheep }}
        </div>
        <div v-else>
          {{ observation.numAnimals }}
        </div>
      </l-tooltip>
    </l-circle-marker>

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
  LGeoJson, LCircleMarker, LPopup, LTooltip,
} from 'vue2-leaflet';
import Registration from '@/components/Registration.vue';

export default {
  name: 'MapObservation',
  components: {
    LGeoJson,
    LCircleMarker,
    Registration,
    LPopup,
    LTooltip,
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
    analysisView: {
      type: Boolean,
      default: false,
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
      tooltipOptions: {
        permanent: true,
        direction: 'center',
        className: 'animal-labels',
      },
    };
  },
  computed: {
    showObservedPoints() {
      return !this.analysisView || this.$store.state.analysis.settings.showObservedPoints;
    },
    showObservation() {
      if (!this.analysisView) {
        return true;
      }
      const settings = this.$store.state.analysis.settings;
      if (this.observation.isSheep) {
        return settings.showObservations;
      }
      return settings.showPredators;
    },
    showNumInPoint() {
      return this.$store.state.analysis.settings.showNumInPoint;
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
.leaflet-tooltip.animal-labels {
  background-color: transparent;
  border: transparent;
  box-shadow: none;
}
</style>
