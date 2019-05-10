
<template>
  <md-content>
    <highcharts
      v-if="settings.comparison"
      :options="comparisonChart"
    />
    <highcharts
      v-else
      :options="mainChart"
    />
    <br>
    <br>
  </md-content>
</template>

<script>
import moment from 'moment';
import { mapState, } from 'vuex';
import { Chart, } from 'highcharts-vue';

export default {
  name: 'Statistics',
  components: {
    highcharts: Chart,
  },
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
          observations: [],
          numPredators: 0,
        },
        last: {
          numSheep: 0,
          numObservations: 0,
          observations: [],
          numPredators: 0,
        },
      };
      this.selectedTrips.forEach(trip => {
        const d = moment(trip.startTime).isBefore(moment().startOf('year')) ? data.last : data.now;
        trip.observations.forEach(observation => {
          d.numObservations += 1;
          if (observation.isSheep) {
            d.observations.push(observation.numSheep);
            d.numSheep += observation.numSheep;
          } else if (observation.predator) {
            d.numPredators += observation.numAnimals;
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
      const observations = [];
      this.$store.state.analysis.selectedTrips.forEach(trip => {
        trip.observations.forEach(observation => {
          if (observation.isSheep) {
            numSheep += observation.numSheep;
            numLambs += observation.numLambs;
            observations.push(observation.numSheep);
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
        observations,
      };
    },
    comparisonChart() {
      const config = {
        chart: {
          type: 'column',
        },
        xAxis: {
          categories: [
            moment().get('year') - 1,
            moment().get('year'),
          ],
          title: {
            text: 'År',
          },
        },
        yAxis: {
          title: {
            text: 'Antall',
          },
        },
        title: {
          text: 'Observasjoner',
        },
      };
      config.series = [
        {
          name: 'Sau',
          data: [
            {
              y: this.comparisonData.last.numSheep,
            },
            {
              y: this.comparisonData.now.numSheep,
            },
          ],
        },
        {
          name: 'Observasjoner',
          data: [
            {
              y: this.comparisonData.last.numObservations,
            },
            {
              y: this.comparisonData.now.numObservations,
            },
          ],
        },
        {
          name: 'Rovdyr',
          data: [
            {
              y: this.comparisonData.last.numPredators,
            },
            {
              y: this.comparisonData.now.numPredators,
            },
          ],
        },
      ];
      return config;
    },
    mainChart() {
      const config = {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Statistikk',
        },
        xAxis: {
          categories: this.selectedTrips.map(elem => {
            return elem.name;
          }),
          visible: false,
          title: {
            text: 'Tur',
          },
        },
        yAxis: {
          title: {
            text: 'Antall',
          },
        },
        series: [],
      };
      const sheep = {
        name: 'Sau',
        data: [],
      };
      const predators = {
        name: 'Rovdyr',
        data: [],
      };
      const observations = {
        name: 'Observasjoner',
        data: [],
      };
      for (let trip of this.selectedTrips) {
        sheep.data.push({
          y: trip.numSheep,
        });
        observations.data.push({
          y: trip.observations.length,
        });
        predators.data.push({
          y: trip.numPredators,
        });
      }
      config.series.push(sheep, observations, predators);
      return config;
    },
  },
};
</script>
