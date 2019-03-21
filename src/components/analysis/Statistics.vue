
<template>
  <md-content>
    <md-list>
      <md-list-item>
        Antall sau i valgt område: {{ data.numSheep }}
      </md-list-item>
      <md-list-item>
        Antall lam observert i området: {{ data.numLambs }}
      </md-list-item>
      <md-list-item>
        Antall rovdyr observert i området: {{ data.numPredators }}
      </md-list-item>
      <md-list-item>
        Antall observasjoner i området: {{ data.numObservations }}
      </md-list-item>
    </md-list>
  </md-content>
</template>

<script>
export default {
  name: 'Statistics',
  computed: {
    data() {
      let numSheep = 0;
      let numLambs = 0;
      let numObservations = 0;
      let numPredators = 0;
      this.$store.state.analysis.selectedTrips.forEach(trip => {
        trip.observations.forEach(observation => {
          if (observation.isSheep) {
            numSheep += observation.numSheep;
            numLambs += observation.numLambs;
          } else if (observation.predator) {
            numPredators += observation.numAnimals;
          }
          numObservations += 1;
        });
      });
      return {
        numSheep,
        numLambs,
        numObservations,
        numPredators,
      };
    },
  },
};
</script>
