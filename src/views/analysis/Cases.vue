
<template>
  <div>
    Brukerhistorier
    <md-list>
      <Case
        v-for="(item, index) of cases"
        :key="index"
        :text="item.text"
        :start-date="item.startDate"
        :end-date="item.endDate"
        :preset-trips="item.presetTrips"
        :show-density="item.showDensity"
        :initial-trips="item.initialTrips"
        :header="item.header"
        :show-observed-points="item.showObservedPoints"
        :show-predators="item.showPredators"
        :group-trips="item.groupTrips"
      />
    </md-list>
  </div>
</template>

<script>
import moment from 'moment';

import Case from '@/components/analysis/Case.vue';

export default {
  name: 'Cases',
  components: {
    Case,
  },
  computed: {
    trips() {
      return this.$store.state.analysis.all;
    },
    cases() {
      const cases = [
        {
          text: 'Se alle turer gjort i ' + moment().get('year'),
          startDate: moment().startOf('year'),
          endDate: moment().endOf('day'),
          presetTrips: true,
          showDensity: true,
          showRoute: false,
        },
        {
          text: 'Se alle turer som er gjort den siste måneden',
          startDate: moment().subtract(1, 'months').startOf('day'),
          endDate: moment().endOf('day'),
          presetTrips: true,
          showRoute: false,
        },
        {
          text: 'Se alle turer som er gjort den siste uken',
          startDate: moment().subtract('7', 'days').startOf('day'),
          endDate: moment().endOf('day'),
          presetTrips: true,
        },
        {
          text: 'Se den siste turen gjennomført',
          presetTrips: true,
          initialTrips: [this.trips[this.trips.length - 1]],
          header: 'Siste tur gjennomført',
          showObservedPoints: true,
          showPredators: true,
        },
        {
          text: 'Egendefinert oppsett',
        },
      ];
      return cases;
    },
  },
};
</script>

<style>

</style>
