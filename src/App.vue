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
        <span class="md-title">Finn Sau</span>
      </md-app-toolbar>
      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
    <div class="phone-viewport">
      <md-bottom-bar
        md-sync-route>
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
    };
  },
  created() {
    console.log('creating app');
    this.$store.dispatch('application/loadSettings');
    this.$store.dispatch('trip/loadTrips');
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
        console.log(position);
      }, (err) => {
        console.log(err);
      }, {
        enableHighAccuracy: true,
      });
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
</style>
