
<template>
  <l-circle-marker
    :lat-lng="observed"
    :radius="10"
    :color="color">
    <l-popup>
      <div v-if="observation.numSheep">
        Antall sau: {{ observation.numSheep }}
      </div>
      <div v-if="observation.numLambs != 0">
        Antall lam: {{ observation.numLambs }}
      </div>
    </l-popup>
  </l-circle-marker>
</template>

<script>
import {
  LCircleMarker, LPopup,
} from 'vue2-leaflet';

export default {
  name: 'ClusterObservation',
  components: {
    LCircleMarker,
    LPopup,
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
    };
  },
};
</script>

<style>

</style>
