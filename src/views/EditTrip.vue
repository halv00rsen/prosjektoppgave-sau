<template>
  <div>
    <h3>Endre data på en tur</h3>
    <md-list>
      <md-list-item
        v-for="trip of trips"
        :key="'trip-' + trip.id"
        @click="openTrip(trip)">

        {{ new Date(trip.startTime) | moment('YYYY.MM.DD') }} - {{ trip.name }}
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
import { mapState, } from 'vuex';
export default {
  name: 'EditTrip',
  computed: {
    ...mapState('trip', {
      trips: 'all',
    }),
  },
  methods: {
    openTrip(trip) {
      this.$store.dispatch('mock/setInitialTrip', trip);
      this.$router.push({ name: 'mock', });
    },
  },
};
</script>

<style>

</style>
