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
import { mapState, } from 'vuex';
export default {
  name: 'Home',
  components: {

  },
  computed: {
    ...mapState('trip', {
      currentOpenTrip: 'openTrip',
    }),
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
