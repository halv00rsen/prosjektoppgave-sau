<template>
  <div class="home">
    <h3>Velkommen til Sau-appen</h3>
    <router-link v-if="currentOpenTrip && !currentOpenTrip.done"
        :to="{name: 'trip', params: {tripId: currentOpenTrip.startTime}}">
      <md-button class="md-raised" :md-ripple="false">
        Fortsett med aktiv tur
      </md-button>
    </router-link>
    <md-button v-else class="md-raised" :md-ripple="false" @click="newTrip()">
      Start ny tur
    </md-button>

    <!-- <router-link v-else
        :to="{name: 'trip', params: {tripId: Date.now()}}">
    </router-link> -->
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {

  },
  methods: {
    newTrip() {
      this.$store.dispatch('trip/saveTrip', 'navn').then((tripId) => {
        this.$router.push({ name: 'trip', params: { tripId: tripId, }, });
      });
    },
  },
  computed: {
    currentOpenTrip() {
      return this.$store.state.trip.openTrip;
    },
  },
}
</script>
