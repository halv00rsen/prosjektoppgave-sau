
<template>
  <md-content>
    <md-list>
      <md-list-item v-if="!fixedTrips">
        <md-checkbox
          v-model="setAll"/>
        <span class="md-list-item-text">
          Velg alle
        </span>
      </md-list-item>
      <md-divider/>
      <md-list-item
        v-for="(item, index) of trips"
        :key="index">
        <md-checkbox
          v-model="selectedTrips"
          :value="item"
          :change="updateTrips()"
          :disabled="fixedTrips"
        />
        <span
          :style="'color: ' + item.color"
          class="md-list-item-text">
          {{ Number(item.startTime) | moment("YYYY.MM.DD") }}
          -
          {{ item.name }}
        </span>
      </md-list-item>
    </md-list>
  </md-content>
</template>

<script>
export default {
  name: 'Trips',
  data: () => ({
    selectedTrips: [],
    lastSize: 0,
  }),
  computed: {
    selectedCase() {
      return this.$store.state.analysis.selectedCase;
    },
    trips() {
      return this.$store.state.analysis.filteredTrips;
    },
    setAll: {
      get() {
        return this.trips.length == this.selectedTrips.length;
      },
      set(value) {
        if (value) {
          this.selectedTrips = this.trips.slice();
        } else {
          this.selectedTrips = [];
        }
      },
    },
    fixedTrips() {
      return this.$store.state.analysis.selectedCase.fixedTrips;
    },
  },
  created() {
    if (this.selectedCase.presetTrips) {
      this.selectedTrips = this.trips.slice();
    }
    if (this.trips.length === 0) {
      this.$store.dispatch('application/setMessage', 'Fant ingen turer i område eller tidsrom');
      // this.$router.push({ name: 'cases', });
    }
  },
  methods: {
    updateTrips() {
      if (this.selectedTrips.length == this.lastSize) {
        return;
      }
      this.lastSize = this.selectedTrips.length;
      this.$store.dispatch('analysis/selectTrips', this.selectedTrips);
    },
  },
};
</script>

<style scoped>
.md-list-item {
  cursor: pointer;
}
</style>
