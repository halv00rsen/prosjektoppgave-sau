<template>
  <div class="home">
    <h3>Velkommen til Sau-appen</h3>
    <router-link
      v-if="currentOpenTrip && !currentOpenTrip.done"
      :to="{name: 'trip', params: {tripId: currentOpenTrip.startTime}}">
      <md-button
        :md-ripple="false"
        class="md-raised">
        Fortsett med aktiv tur
      </md-button>
    </router-link>
    <md-button
      v-else
      :md-ripple="false"
      class="md-raised"
      @click="newTrip()">
      Start ny tur
    </md-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {

  },
  computed: {
    currentOpenTrip() {
      return this.$store.state.trip.openTrip;
    },
  },
  methods: {
    newTrip() {
      this.$store.dispatch('trip/saveTrip', 'navn').then((tripId) => {
        this.$router.push({ name: 'trip', params: { tripId: tripId, }, });
      });
    },
  },
};
</script>
