
<template>
  <div>
    <router-view v-if="positionRetrieved"/>
    <div v-else>
      Vennligst skru på posisjon, applikasjonen fungerer ikke uten.
    </div>
    <div class="phone-viewport">
      <md-bottom-bar
        ref="bottom-bar"
        :disabled="!loading">
        <md-bottom-bar-item
          v-for="(route, index) of routes"
          :key="index"
          :to="route.link"
          :md-icon="route.icon"
          :md-label="route.text"/>
      </md-bottom-bar>
    </div>
  </div>
</template>

<script>
import { LatLng, } from 'leaflet';

export default {
  name: 'TripView',
  data() {
    return {
      routes: [
        {
          link: {
            name: 'home',
          },
          icon: 'home',
          text: 'Aktiv Tur',
        },
        {
          link: {
            name: 'trips',
          },
          icon: 'directions_walk',
          text: 'Mine Turer',
        },
        {
          link: {
            name: 'map',
          },
          icon: 'map',
          text: 'Kart',
        },
      ],
      watchId: -1,
    };
  },
  computed: {
    positionRetrieved() {
      return this.$store.getters['application/positionRetrieved'];
    },
    loading() {
      return this.$store.getters['trip/dataLoaded'];
    },
  },
  created() {
    this.$store.dispatch('application/setTripView', true);
    this.retrieveCurrentPosition();
    this.watchId = setInterval(this.retrieveCurrentPosition, 10000);
  },
  beforeDestroy() {
    clearInterval(this.watchId);
    this.$store.dispatch('application/setTripView', false);
    this.$store.dispatch('application/setPositionRetrieved', false);
  },
  methods: {
    retrieveCurrentPosition() {
      navigator.geolocation.getCurrentPosition((pos) => {
        const position = new LatLng(pos.coords.latitude, pos.coords.longitude);
        this.$store.dispatch('trip/setPosition', position);
        this.$store.dispatch('application/setPositionRetrieved', true);
        console.log(position);
      }, (err) => {
        console.log(err);
        this.$store.dispatch('application/setPositionRetrieved', false);
      }, {
        enableHighAccuracy: true,
      });
    },
  },
};
</script>

<style scoped>
.md-bottom-bar-item {
  width: 100%;
}

.phone-viewport {
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  /* background-color: #333; */
  position: fixed;
  /* flex-shrink: 0; */
}
</style>
