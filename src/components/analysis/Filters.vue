
<template>
  <md-content>
    <md-list>
      <list-switch
        dispatch="setShowObservations"
        variable="showObservations"
        text="Vis saueobservasjoner"/>
      <list-switch
        dispatch="setShowObservedPoints"
        variable="showObservedPoints"
        text="Vis observasjonspunkter"/>
      <list-switch
        dispatch="setShowDensity"
        variable="showDensity"
        text="Vis tetthet"/>
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
};
</script>
