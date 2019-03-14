<template>
  <l-circle-marker
    :lat-lng="[latitude, longitude]"
    :radius="10"
    :color="color"
  />
</template>

<script>
import {
  LCircleMarker,
} from 'vue2-leaflet';

export default {
  name: 'MapTrail',
  components: {
    LCircleMarker,
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
    color: {
      type: String,
      default: '#000',
    },
  },
};
</script>
