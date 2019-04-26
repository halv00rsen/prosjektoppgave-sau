
<template>
  <div>
    <l-polygon
      :lat-lngs="trip.positions"
      :color="trip.color"
      :fill-opacity="fillOpacityPolygon"
      @mouseover="enter()"
      @mouseleave="leave()"
      @click="zoomMap(trip.getBounds())"
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
      fillOpacityPolygon: 0.2,
    };
  },
  methods: {
    leave() {
      this.showPolygon = false;
      this.fillOpacityPolygon = 0.2;
    },
    enter() {
      this.showPolygon = true;
      this.fillOpacityPolygon = 0.7;
    },
  },
};
</script>
