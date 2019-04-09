
<template>
  <md-content>
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
        :disabled="showDensity"
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
        :disabled="showObservedPoints || settings.groupTrips"
        dispatch="setShowDensity"
        variable="showDensity"
        text="Tetthet"/>
      <list-switch
        :disabled="showDensity"
        dispatch="setGroupTrips"
        variable="groupTrips"
        text="Tur som punkt ved lav zoom"/>
      <list-switch
        dispatch="setShowRectangle"
        variable="showRectangle"
        text="Turgrenser"/>
    </md-list>
  </md-content>
</template>

<script>
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
    settings() {
      return this.$store.state.analysis.settings;
    },
    showObservedPoints() {
      return this.$store.state.analysis.settings.showObservedPoints;
    },
    showDensity() {
      return this.$store.state.analysis.settings.showDensity;
    },

  },
};
</script>
