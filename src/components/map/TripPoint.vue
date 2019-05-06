
<template>
  <div>
    <l-polygon
      :lat-lngs="trip.positions"
      :color="color"
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
import { mapState, } from 'vuex';

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
  computed: {
    ...mapState('analysis', [
      'settings',
    ]),
    color() {
      if (this.settings.showTime) {
        return this.settings.selectedTimeTrip === this.trip ? 'red' : 'gray';
      }
      return this.trip.color;
    },
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
