
<template>
  <md-content>
    <!-- <md-switch v-model="toggleTrips">Veksle turer</md-switch> -->
    <md-list>
      <md-list-item @click="setZoomBounds(totalBounds)">
        <md-checkbox
          v-model="setAll"
          :disabled="fixedTrips"
        />
        <span class="md-list-item-text">
          Velg alle
        </span>
      </md-list-item>
      <md-divider/>
      <md-list-item
        v-for="(item, index) of trips"
        :key="index"
        @click="setZoomBounds(item.getBounds())">
        <md-checkbox
          v-model="selectedTrips"
          :value="item"
          :change="updateTrips()"
          :disabled="fixedTrips"
        />
        <span
          :style="'color: ' + item.color"
          class="md-list-item-text"
        >
          {{ Number(item.startTime) | moment("YYYY.MM.DD") }}
          -
          {{ item.name }}
        </span>
      </md-list-item>
    </md-list>
  </md-content>
</template>

<script>
import { mapGetters, mapState, } from 'vuex';

export default {
  name: 'Trips',
  data: () => ({
    selectedTrips: [],
    lastSize: 0,
    toggleTrips: false,
  }),
  computed: {
    ...mapState('analysis', {
      selectedCase: 'selectedCase',
      trips: 'filteredTrips',
      settings: 'settings',
    }),
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
      return this.selectedCase.fixedTrips || this.settings.showTime;
    },
    ...mapGetters('analysis', {
      totalBounds: 'getBounds',
    }),
  },
  created() {
    if (this.selectedCase.presetTrips) {
      this.selectedTrips = this.trips.slice();
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
    setZoomBounds(bounds) {
      this.$store.dispatch('analysis/setFitBounds', bounds);
    },
  },
};
</script>

<style scoped>
.md-list-item {
  cursor: pointer;
}
</style>
