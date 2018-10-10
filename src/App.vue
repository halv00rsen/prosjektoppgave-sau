<template>
  <div id="app" class="page-container">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons">
    <!-- <md-app md-mode="reveal"> -->
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">Finn sau</span>
      </md-app-toolbar>

      <!-- <md-app-drawer :md-active.sync="menuVisible"> -->
      <md-app-drawer md-permanent="full" :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">SauSau</md-toolbar>

        <md-list>
          <NavigationLink link="/" icon="home" text="Hjem" :close="close">
          </NavigationLink>

          <NavigationLink :link="{ name: 'trips' }" icon="directions_walk" text="Dine Turer" :close="close">
          </NavigationLink>

          <NavigationLink link="/map" icon="map" text="Kart" :close="close">
          </NavigationLink>

          <NavigationLink link="/about" icon="info" text="Informasjon" :close="close">
          </NavigationLink>

        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import NavigationLink from './components/NavigationLink.vue';

export default {
  components: {
    NavigationLink,
  },
  data() {
    return {
      menuVisible: false,
      watchId: -1,
    }
  },
  beforeCreate() {
    console.log('creating app');
    this.$store.dispatch('trip/loadTrips');
    this.watchId = navigator.geolocation.watchPosition((pos) => {
      this.$store.dispatch('trip/setPosition', {
        lng: pos.coords.longitude,
        lat: pos.coords.latitude,
      });
      console.log(pos);
    }, (err) => {
      console.log('error');
      console.log(err);
    }, {
      enableHighAccuracy: true,
    })
  },
  mounted() {
  },
  methods: {
    close() {
      this.menuVisible = false;
    },
  },
}
</script>

<style scoped>
.md-drawer {
  width: 20em;
  /* max-width: calc(100vw - 125px); */
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
