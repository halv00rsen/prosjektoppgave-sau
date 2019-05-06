
<template>
  <md-content>
    <h4>Hovedvisning</h4>
    <md-divider/>
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
          value="showHeatmap">Heatmap</md-radio>
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
    <h4>Annet</h4>
    <md-divider/>
    <md-list>
      <list-switch
        dispatch="setShowObservations"
        variable="showObservations"
        text="Saueobservasjoner"/>
      <list-switch
        dispatch="setShowPredators"
        variable="showPredators"
        text="Rovdyrobservasjoner"/>
      <md-divider/>
      <list-switch
        dispatch="setShowObservedPoints"
        variable="showObservedPoints"
        text="Observasjonspunkter"/>
      <list-switch
        dispatch="setShowNumInPoint"
        variable="showNumInPoint"
        text="Antall dyr observert i punkt"/>
      <md-divider/>
      <list-switch
        dispatch="setShowRoute"
        variable="showRoute"
        text="Turrute"/>
      <list-switch
        dispatch="setGroupTrips"
        variable="groupTrips"
        text="Tur som punkt ved lav zoom"/>
      <list-switch
        dispatch="setShowRectangle"
        variable="showRectangle"
        text="Turgrenser"/>
    </md-list>
    <br>
  </md-content>
</template>

<script>
import { mapState, } from 'vuex';

import ListSwitch from '@/components/analysis/ListSwitch.vue';

export default {
  name: 'Filters',
  components: {
    ListSwitch,
  },
  data() {
    return {
      debug: process.env.VUE_APP_DEBUG,
    };
  },
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
