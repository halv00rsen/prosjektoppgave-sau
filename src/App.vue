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
        <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

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
    }
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

/* .md-app-content {
  margin-left: 2em;
} */
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
