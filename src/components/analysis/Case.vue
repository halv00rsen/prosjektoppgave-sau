
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
    header: {
      type: String,
      default: undefined,
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
    showRoute: {
      type: Boolean,
      default: true,
    },
    initialTrips: {
      type: Array,
      default: undefined,
    },
    showObservedPoints: {
      type: Boolean,
      default: false,
    },
    showPredators: {
      type: Boolean,
      default: false,
    },
    groupTrips: {
      type: Boolean,
      default: true,
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
        fixedTrips: this.initialTrips !== undefined,
        header: this.header !== undefined ? this.header : this.text,
      });
      if (this.showDensity) {
        this.$store.dispatch('analysis/setShowDensity', this.showDensity);
        this.$store.dispatch('analysis/setShowObservedPoints', false);
        this.$store.dispatch('analysis/setGroupTrips', false);
      } else {
        this.$store.dispatch('analysis/setShowObservedPoints', this.showObservedPoints);
        this.$store.dispatch('analysis/setGroupTrips', this.groupTrips);
      }
      this.$store.dispatch('analysis/setShowRoute', this.showRoute);
      if (this.initialTrips) {
        this.$store.dispatch('analysis/setInitialTrips', this.initialTrips);
      }
      this.$store.dispatch('analysis/setShowPredators', this.showPredators);
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
