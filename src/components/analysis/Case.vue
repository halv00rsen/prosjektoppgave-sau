
<template>
  <md-list-item @click="openCase">
    {{ text }}
  </md-list-item>
</template>

<script>
export default {
  name: 'Case',
  props: {
    text: {
      type: String,
      required: true,
    },
    startDate: {
      type: Object|Date,
      default: undefined,
    },
    endDate: {
      type: Object|Date,
      default: undefined,
    },
    presetTrips: {
      type: Boolean,
      default: false,
    },
    showDensity: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    openCase() {
      this.$store.dispatch('analysis/setDates', {
        startDate: this.startDate,
        endDate: this.endDate,
      });
      this.$store.dispatch('analysis/setSelectedCase', {
        text: this.text,
        presetTrips: this.presetTrips,
      });
      if (this.showDensity) {
        this.$store.dispatch('analysis/setShowDensity', this.showDensity);
        this.$store.dispatch('analysis/setShowObservedPoints', false);
      }
      this.$router.push('overview');
    },
  },
};
</script>

<style scoped>
.md-list-item {
  border: black solid 1px;
  margin: 1em;
}
</style>

