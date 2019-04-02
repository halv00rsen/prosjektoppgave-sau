
<template>
  <l-circle-marker
    v-if="showObservation"
    :lat-lng="observed"
    :radius="10"
    :fill="true"
    :fill-opacity="1"
    :fill-color="observation.isSheep ? 'white' : 'gray'"
    :color="color">
    <l-popup>
      <div v-if="observation.isSheep">
        <div v-if="observation.numSheep">
          Antall sau: {{ observation.numSheep }}
        </div>
        <div v-if="observation.numLambs != 0">
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
</template>

<script>
import {
  LCircleMarker, LPopup, LTooltip,
} from 'vue2-leaflet';

export default {
  name: 'ClusterObservation',
  components: {
    LCircleMarker,
    LPopup,
    LTooltip,
  },
  props: {
    color: {
      type: String,
      required: true,
    },
    observation: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      observed: [this.observation.position.lat, this.observation.position.lng],
      tooltipOptions: {
        permanent: true,
        direction: 'center',
        className: 'animal-labels',
      },
    };
  },
  computed: {
    showObservation() {
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
};
</script>

<style>

</style>
