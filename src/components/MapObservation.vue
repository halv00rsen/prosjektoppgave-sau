<template>
  <div v-if="showObservation">
    <l-geo-json
      v-if="showObservedPoints"
      :geojson="geojson"
      :options-style="styles"
    />

    <l-circle-marker
      ref="marker"
      :lat-lng="observed"
      :radius="radius"
      :color="color"
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
          <div>Antall {{ observation.animal }}: {{ observation.numAnimals }}</div>
        </div>
      </l-popup>
      <l-tooltip
        v-if="settings.showNumInPoint"
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
import moment from 'moment';
import {
  LGeoJson, LCircleMarker, LPopup, LTooltip,
} from 'vue2-leaflet';
import { mapState, } from 'vuex';

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
    showGrayColor: {
      type: Boolean,
      default: false,
    },
    dateConducted: {
      type: Number,
      default: undefined,
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
            // properties: {
            //   color: this.color,
            // },
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
    ...mapState('analysis', [
      'settings',
    ]),
    showObservedPoints() {
      return !this.analysisView || this.settings.showObservedPoints;
    },
    showObservation() {
      if (!this.analysisView) {
        return true;
      }
      if (this.observation.isSheep) {
        return this.settings.showObservations;
      }
      return this.settings.showPredators;
    },
    radius() {
      if (this.settings.pointSizing) {
        if (this.observation.isSheep) {
          return 2 * this.observation.numSheep + 10;
        }
        return 2 * this.observation.numAnimals + 10;
      }
      return 10;
    },
    color() {
      if (this.settings.showTime) {
        if (this.showGrayColor) {
          return 'gray';
        }
        return 'red';
      }
      if (this.settings.comparison) {
        const date = moment(this.dateConducted);
        if (date.isBefore(moment().startOf('year'))) {
          return 'blue';
        }
        return 'green';
      }
      return this.observationColor;
    },
    styles() {
      return {
        color: this.color,
      };
    },
  },
  mounted() {
    if (this.showObservation) {
      this.$nextTick(() => {
        this.$refs.marker.mapObject.properties = {
          isSheep: this.observation.isSheep,
          numSheep: this.observation.numSheep,
        };
      });
    }
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
    getProperty() {
      return {
        observation: this.observation,
      };
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
