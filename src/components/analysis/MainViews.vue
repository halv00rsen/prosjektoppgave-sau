<template>
  <md-content>
    <md-list>
      <md-list-item>
        <md-radio
          v-model="mainView"
          value="regular">Vanlig</md-radio>
      </md-list-item>
      <md-list-item>
        <md-radio
          v-model="mainView"
          value="pointSizing">Størrelse</md-radio>
      </md-list-item>
      <md-list-item>
        <md-radio
          v-model="mainView"
          value="showHeatmap">Varmekart</md-radio>
      </md-list-item>
      <md-list-item>
        <md-radio
          v-model="mainView"
          value="showDensity">Grupper</md-radio>
      </md-list-item>
      <md-list-item>
        <md-radio
          v-model="mainView"
          value="showTime">Tid</md-radio>
      </md-list-item>
    </md-list>
  </md-content>
</template>

<script>
import { mapState, } from 'vuex';

export default {
  name: 'MainViews',
  computed: {
    ...mapState('analysis', [
      'settings',
    ]),
    mainView: {
      get() {
        if (this.settings.showHeatmap) {
          return 'showHeatmap';
        } else if (this.settings.pointSizing) {
          return 'pointSizing';
        } else if (this.settings.showDensity) {
          return 'showDensity';
        } else if (this.settings.showTime) {
          return 'showTime';
        }
        return 'regular';
      },
      set(value) {
        this.$store.dispatch('analysis/setMainView', value);
      },
    },
  },
};
</script>

<style>

</style>
