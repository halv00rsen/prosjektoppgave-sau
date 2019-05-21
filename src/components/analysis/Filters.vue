
<template>
  <md-content>
    Filtre
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
        :disabled="!settings.showRoute"
        dispatch="setGroupTrips"
        variable="groupTrips"
        text="Tur som punkt ved lav zoom"
      />
      <list-switch
        dispatch="setShowRectangle"
        variable="showRectangle"
        text="Turgrenser"/>
    </md-list>
    Ekstern statistikk
    <Settings/>
  </md-content>
</template>

<script>
import ListSwitch from '@/components/analysis/ListSwitch.vue';
import Settings from '@/components/analysis/Settings.vue';
import { mapState, } from 'vuex';

export default {
  name: 'Filters',
  components: {
    ListSwitch,
    Settings,
  },
  computed: {
    ...mapState('analysis', [
      'settings',
    ]),
  },
};
</script>
