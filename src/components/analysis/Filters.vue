
<template>
  <md-content>
    <md-list>
      <list-switch
        dispatch="setShowObservations"
        variable="showObservations"
        text="Vis saueobservasjoner"/>
      <list-switch
        :disabled="showDensity"
        dispatch="setShowObservedPoints"
        variable="showObservedPoints"
        text="Vis observasjonspunkter"/>
      <list-switch
        :disabled="showObservedPoints || settings.groupTrips"
        dispatch="setShowDensity"
        variable="showDensity"
        text="Vis tetthet"/>
      <list-switch
        dispatch="setShowRoute"
        variable="showRoute"
        text="Vis turrute"/>
      <list-switch
        dispatch="setShowPredators"
        variable="showPredators"
        text="Vis rovdyrobservasjoner"/>
      <list-switch
        dispatch="setShowNumInPoint"
        variable="showNumInPoint"
        text="Vis antall dyr observert i punkt"/>
      <list-switch
        :disabled="showDensity"
        dispatch="setGroupTrips"
        variable="groupTrips"
        text="Vis tur som punkt ved lav zoom"/>
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
