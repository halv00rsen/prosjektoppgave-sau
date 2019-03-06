
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
        :disabled="showObservedPoints"
        dispatch="setShowDensity"
        variable="showDensity"
        text="Vis tetthet"/>
      <list-switch
        :disabled="true"
        dispatch="setShowPredators"
        variable="showPredators"
        text="Vi rovdyrobservasjoner"/>
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
    showObservedPoints() {
      return this.$store.state.analysis.settings.showObservedPoints;
    },
    showDensity() {
      return this.$store.state.analysis.settings.showDensity;
    },
  },
};
</script>
