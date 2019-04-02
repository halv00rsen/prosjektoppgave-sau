<template>
  <main-map
    @clickMap="clickMap($event)">
    <trail-route
      :positions="positions"
    />

    <l-circle-marker
      v-if="observation.observedPosition"
      :lat-lng="observation.observedPosition"
      :radius="10"
      color="red"
    />

    <registration
      v-if="openRegistration"
      :detailed="currentClick === 2"
      :show="openRegistration"
      :close="closeRegistration"
      :save-registration="saveRegistration"
      :mock="true"
    />

    <map-observation
      v-for="(observation, index) of observations"
      :key="'obs-' + index"
      :observation="observation"
      :clickable="false"
      :mock="true"
    />
  </main-map>
</template>

<script>
import {
  LCircleMarker,
} from 'vue2-leaflet';

import MainMap from '@/components/map/MainMap.vue';
import Registration from '@/components/Registration.vue';
import MapObservation from '@/components/MapObservation.vue';
import TrailRoute from '@/components/TrailRoute.vue';

export default {
  name: 'MockMap',
  components: {
    Registration,
    MapObservation,
    TrailRoute,
    MainMap,
    LCircleMarker,
  },
  data () {
    return {
      observation: {
        position: undefined,
        observedPosition: undefined,
      },
      openRegistration: false,
    };
  },
  computed: {
    positions() {
      return this.$store.state.mock.positions;
    },
    observations() {
      return this.$store.state.mock.observations;
    },
    currentClick() {
      return this.$store.state.mock.currentClick;
    },
  },
  watch: {
    currentClick() {
      this.resetObservation();
    },
  },
  methods: {
    clickMap(event) {
      if (this.currentClick === 4) {
        return;
      } else if (this.currentClick === 1) {
        this.$store.dispatch('mock/clickMap', event.latlng);
      } else if (this.currentClick === 2 || this.currentClick === 3) {
        if (!this.observation.observedPosition) {
          this.observation.observedPosition = event.latlng;
        } else {
          this.observation.position = event.latlng;
          this.openRegistration = true;
        }
      }
    },
    closeRegistration() {
      this.openRegistration = false;
      this.resetObservation();
    },
    resetObservation() {
      this.observation = {
        position: undefined,
        observedPosition: undefined,
      };
    },
    saveRegistration(form) {
      this.openRegistration = false;
      form.position = this.observation.position;
      form.observedPosition = this.observation.observedPosition;
      this.$store.dispatch('mock/addObservation', form);
      this.resetObservation();
    },
  },
};
</script>

<style>

</style>
