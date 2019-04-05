<template>
  <div>
    <md-button
      :md-ripple="false"
      class="md-raised"
      @click="removeEmptyTrips()">
      Fjern turer uten data
    </md-button>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  methods: {
    removeEmptyTrips() {
      this.$store.dispatch('trip/cleanEmptyTrips');
    },
  },
};
</script>

<style>

</style>
