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
    <div
      v-else>
      <md-button
        :md-ripple="false"
        class="md-raised"
        @click="newTrip()">
        Start ny tur
      </md-button>
    </div>
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
  // beforeRouteEnter (to, from, next) {
  //   console.log(to);
  //   console.log(from);
  //   console.log(next);
  //   // called before the route that renders this component is confirmed.
  //   // does NOT have access to `this` component instance,
  //   // because it has not been created yet when this guard is called!
  // },
};
</script>
