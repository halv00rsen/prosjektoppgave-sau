<template>
  <l-map
    ref="map"
    :zoom.sync="zoom"
    :center="center"
    :options="mapOptions"
    :max-zoom="18"
    :min-zoom="4"
    style="height: 70vh;"
    @update:center="centerUpdated"
    @click="clickMap($event)"
  >
    <l-control-layers
      :collapsed="false"
      :sort-layers="true"
      position="topright"
    />
    <l-tile-layer
      v-for="url in urls"
      :key="url.visual"
      :name="url.visual"
      :visible="true"
      :url="url.url"
      :attribution="attribution"
      layer-type="base"
    />

    <map-trail
      v-for="(pos, index) of positions"
      :key="'trail-' + index"
      :latitude="pos.lat"
      :longitude="pos.lng"/>

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
  </l-map>
</template>

<script>
import {
  LMap, LTileLayer, LControlLayers, LCircleMarker,
} from 'vue2-leaflet';

import MapTrail from '@/components/MapTrail.vue';
import Registration from '@/components/Registration.vue';
import MapObservation from '@/components/MapObservation.vue';

export default {
  name: 'MockMap',
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LCircleMarker,
    MapTrail,
    Registration,
    MapObservation,
  },
  props: {

  },
  data () {
    return {
      zoom: 5,
      center: {
        lat: 65,
        lng: 18,
      },
      urls: [
        {
          url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}',
          visual: 'Gråtone',
        },
        {
          url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
          visual: 'Terrengkart',
        },
      ],
      attribution: '&copy; <a href="https://www.kartverket.no/">Kartverket</a>',
      mapOptions: {},
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
  mounted() {
  },
  methods: {
    centerUpdated(center) {
      this.center = center;
    },
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
