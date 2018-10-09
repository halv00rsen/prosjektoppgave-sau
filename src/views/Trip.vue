<template>
  <div v-if="trip">
    <p>Navn: {{trip.name}}</p>
    <p>Start: {{ Number(trip.startTime) | moment("YYYY.MM.DD - HH:mm:ss") }}</p>
    <p v-if="trip.endTime">Slutt: {{ Number(trip.endTime) | moment("YYYY.MM.DD - HH:mm:ss") }}</p>
    <SheepMap
      v-bind:useDownload="false">
    </SheepMap>
    <md-button class="md-raised" :md-ripple="false">
      Registrer sau her
    </md-button>

    <md-button v-if="!trip.done" class="md-raised" :md-ripple="false" @click="finishTrip">
      Avslutt tur
    </md-button>
  </div>
  <div v-else>
    404 - Fant ikke turen du leter etter!
  </div>
</template>

<script>
import SheepMap from '@/components/SheepMap.vue';
import { mapState, } from 'vuex';

export default {
  name: 'Trip',
  components: {
    SheepMap,
  },
  props: {
  },
  methods: {
    finishTrip() {
      this.$store.dispatch('trip/setActiveTripDone');
    },
  },
  created() {
    if (!this.$store.state.activeTrip) {
      this.$store.dispatch('trip/setActiveTrip', this.$route.params.tripId).then((data) => {
      });
    }
  },
  mounted() {

  },
  computed: {
    trip() {
      return this.$store.state.trip.activeTrip;
    },
  },
}
</script>
