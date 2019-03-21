<template>
  <div
    id="app"
    class="page-container">
    <link
      rel="stylesheet"
      href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons">
    <md-app md-mode="fixed">
      <md-app-toolbar>
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <span
              class="md-title"
              @click="$router.push('/')">Sauappen</span>
          </div>
          <div
            class="md-toolbar-section-end">
            <span>
              <md-button
                :disabled="true"
                class="md-icon-button">
                <md-icon :style="positionColor">my_location</md-icon>
              </md-button>
              <md-tooltip
                md-direction="bottom"
                md-delay="500">{{ posText }}</md-tooltip>
            </span>
            <md-button
              class="md-icon-button"
              @click="$router.push('/');">
              <md-icon>arrow_back</md-icon>
            </md-button>
          </div>
        </div>
      </md-app-toolbar>
      <md-app-content v-if="!loading">
        Laster
      </md-app-content>
      <md-app-content v-else>
        <router-view/>
      </md-app-content>
    </md-app>
    <alert-box/>
  </div>
</template>

<script>
import NavigationLink from './components/NavigationLink.vue';
import AlertBox from './components/AlertBox.vue';

export default {
  name: 'App',
  components: {
    NavigationLink,
    AlertBox,
  },
  data() {
    return {
      menuVisible: false,
    };
  },
  computed: {
    loading() {
      return this.$store.getters['trip/dataLoaded'];
    },
    isTripView() {
      return this.$store.getters['application/isTripView'];
    },
    positionColor() {
      if (this.$store.getters['application/positionRetrieved']) {
        return 'color:green;';
      } else {
        return 'color:red;';
      }
    },
    posText() {
      if (this.$store.getters['application/positionRetrieved']) {
        return 'Posisjon er på';
      } else {
        return 'Posisjon er av';
      }
    },
  },
  created() {
    this.$store.dispatch('application/loadSettings');
  },
};
</script>

<style scoped>
.md-drawer {
  width: 20em;
}
.md-title:hover {
  cursor: pointer;
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

* > .md-content {
  max-width: 1300px;
  margin: auto;
}

.md-bottom-bar-item {
  max-width: 100% !important;
}
.md-app-content {
  border-left: none !important;
  border-right: none !important;
}
</style>
