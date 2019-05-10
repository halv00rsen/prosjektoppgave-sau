
<template>
  <md-content>
    <md-list v-if="!settings.comparison">
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
      <md-list-item v-if="data.numPredators !== 0">
        <span class="md-list-item-text">
          Rovdyr observert:
          <span
            v-for="predator of data.predators"
            :key="'animal-' + predator">
            {{ predator }}
          </span>
        </span>
      </md-list-item>
    </md-list>
    <md-list v-else>
      <md-list-item>
        <span class="md-list-item-text">{{ new Date() | moment("YYYY") }}</span>
      </md-list-item>
      <md-list-item>
        <span class="md-list-item-text">Antall observasjoner: {{ comparisonData.now.numObservations }}</span>
      </md-list-item>
      <md-list-item>
        <span class="md-list-item-text">Antall sau: {{ comparisonData.now.numSheep }}</span>
      </md-list-item>
      <md-divider/>
      <md-list-item>
        <span class="md-list-item-text">{{ lastYear }}</span>
      </md-list-item>
      <md-list-item>
        <span class="md-list-item-text">Antall observasjoner: {{ comparisonData.last.numObservations }}</span>
      </md-list-item>
      <md-list-item>
        <span class="md-list-item-text">Antall sau: {{ comparisonData.last.numSheep }}</span>
      </md-list-item>
    </md-list>
  </md-content>
</template>

<script>
import moment from 'moment';
import { mapState, } from 'vuex';
export default {
  name: 'Statistics',
  data() {
    return {
      lastYear: moment().get('year') - 1,
    };
  },
  computed: {
    ...mapState('analysis', [
      'settings',
      'selectedTrips',
    ]),
    comparisonData() {
      const data = {
        now: {
          numSheep: 0,
          numObservations: 0,
        },
        last: {
          numSheep: 0,
          numObservations: 0,
        },
      };
      this.selectedTrips.forEach(trip => {
        const d = moment(trip.startTime).isBefore(moment().startOf('year')) ? data.last : data.now;
        trip.observations.forEach(observation => {
          d.numObservations += 1;
          if (observation.isSheep) {
            d.numSheep += observation.numSheep;
          }
        });
      });
      return data;
    },
    data() {
      let numSheep = 0;
      let numLambs = 0;
      let numObservations = 0;
      let numPredators = 0;
      let predators = new Set();
      this.$store.state.analysis.selectedTrips.forEach(trip => {
        trip.observations.forEach(observation => {
          if (observation.isSheep) {
            numSheep += observation.numSheep;
            numLambs += observation.numLambs;
          } else if (observation.predator) {
            numPredators += observation.numAnimals;
            predators.add(observation.animal);
          }
          numObservations += 1;
        });
      });
      return {
        numSheep,
        numLambs,
        numObservations,
        numPredators,
        predators,
      };
    },

  },
};
</script>
