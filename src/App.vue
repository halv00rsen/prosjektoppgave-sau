<template>
  <div
    id="app"
    class="page-container">
    <link
      rel="stylesheet"
      href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons">
    <md-app md-mode="fixed">
      <md-app-toolbar>
        <!-- <h3 class="md-title">Finn sau</h3> -->
        <span class="md-title">Finn Sau. Pos på {{ positionRetrieved }}  {{ $route.name }}</span>
      </md-app-toolbar>
      <md-app-content
        v-if="!loading">
        Laster
      </md-app-content>
      <md-app-content
        v-else>
        <router-view v-if="positionRetrieved"/>
        <div v-else>
          Vennligst skru på posisjon, applikasjonen fungerer ikke uten.
        </div>
      </md-app-content>
    </md-app>
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
    <alert-box/>
  </div>
</template>

<script>
import NavigationLink from './components/NavigationLink.vue';
import AlertBox from './components/AlertBox.vue';
import { LatLng, } from 'leaflet';

export default {
  name: 'App',
  components: {
    NavigationLink,
    AlertBox,
  },
  data() {
    return {
      menuVisible: false,
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
    routes() {
      const routes = [
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
      ];
      // if (this.$store.state.trip.openTrip) {
      //   routes[0].link = {
      //     name: 'trip', 
      //     params: {
      //       tripId: this.$store.state.trip.openTrip.startTime,
      //     },
      //   };
      // }
      return routes;
    },
  },
  beforeCreate() {
    console.log('before create');
  },
  created() {
    console.log('creating app');
    this.$store.dispatch('application/loadSettings');
    // this.$store.dispatch('trip/loadTrips');
    this.retrieveCurrentPosition();
    this.watchId = setInterval(this.retrieveCurrentPosition, 10000);
  },
  beforeDestroy() {
    clearInterval(this.watchId);
  },
  mounted() {
  },
  methods: {
    close() {
      this.menuVisible = false;
    },
    retrieveCurrentPosition() {
      console.log('retrieving position');
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
    hehe() {
      console.log('ok?');
    },
    clickedBar(index) {
      console.log(index);
      // this.$refs['bottom-bar'].setActiveItemByIndex(index); 
    },
  },
};
</script>

<style scoped>
.md-drawer {
  width: 20em;
}

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

<style>
html {
  height: 100%;
}

body {
  height: 100%;
}

#app {
  height: 100%;
}

.md-app {
  height: 100%;
}

.md-app-scroller {
  margin-bottom: 60px;
}

.md-bottom-bar-item {
  max-width: 100% !important;
}
</style>
