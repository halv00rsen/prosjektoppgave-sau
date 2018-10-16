<template>
  <div v-if="trip">
    <p>Navn: {{trip.name}}</p>
    <p>Start: {{ Number(trip.startTime) | moment("YYYY.MM.DD - HH:mm:ss") }}</p>
    <p v-if="trip.endTime">Slutt: {{ Number(trip.endTime) | moment("YYYY.MM.DD - HH:mm:ss") }}</p>
    <SheepMap ref="sheepMap"
      v-bind:useDownload="false">
    </SheepMap>

    <md-button v-if="!trip.done" class="md-raised" :md-ripple="false" @click="registerSheep">
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
    registerSheep() {
      this.$store.dispatch('trip/registerObservation', this.$refs.sheepMap.center);
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
