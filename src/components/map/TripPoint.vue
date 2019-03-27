
<template>
  <div>
    <l-polygon
      v-if="showPolygon"
      :lat-lngs="trip.positions"
      :color="trip.color"
    />
    <l-circle-marker
      :lat-lng="trip.getCenter()"
      :radius="10"
      :color="trip.color"
      :fill-opacity="0.8"
      :fill-color="trip.color"
      pane="markerPane"
      @click="zoomMap(trip.getBounds())"
      @mouseover="enter()"
      @mouseleave="leave()"
    />
  </div>
</template>

<script>
import {
  LCircleMarker, LPolygon,
} from 'vue2-leaflet';
import Trip from '@/models/trip';

export default {
  name: 'Trip',
  components: {
    LCircleMarker,
    LPolygon,
  },
  props: {
    trip: {
      type: Trip,
      required: true,
    },
    zoomMap: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      polygon: undefined,
      showPolygon: false,
    };
  },
  methods: {
    leave() {
      this.showPolygon = false;
    },
    enter() {
      this.showPolygon = true;
    },
  },
};
</script>
