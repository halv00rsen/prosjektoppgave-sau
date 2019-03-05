
<template>
  <div class="stats-view md-scrollbar">
    <md-tabs
      style="height: 80vh;"
      md-alignment="fixed">
      <md-tab
        id="tab-statistics"
        md-label="Statistikk">
        Masse statistikk
      </md-tab>
      <md-tab
        id="tab-trips"
        md-label="Turer">
        <md-content style="height: 74vh; overflow-y: auto;">
          <md-list>
            <md-list-item>
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
                v-model="array"
                :value="item"
                :change="updateTrips()"/>
              <span class="md-list-item-text">
                {{ Number(item.startTime) | moment("YYYY.MM.DD") }}
                -
                {{ item.name }}
              </span>
            </md-list-item>
          </md-list>
        </md-content>
      </md-tab>
      <md-tab
        id="tab-filter"
        md-label="Filter">
        Filterfane
      </md-tab>
    </md-tabs>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  data: () => ({
    array: [],
    lastSize: 0,
  }),
  computed: {
    trips() {
      return this.$store.state.analysis.filteredTrips;
    },
    setAll: {
      get() {
        return this.trips.length == this.array.length;
      },
      set(value) {
        if (value) {
          this.$store.dispatch('analysis/activateAllTrips').then(() => {
            this.array = this.trips.slice();
          });
        } else {
          this.$store.dispatch('analysis/deselectTrips').then(() => {
            this.array = [];
          });
        }
      },
    },
  },
  methods: {
    updateTrips() {
      if (this.array.length == this.lastSize) {
        return;
      }
      this.lastSize = this.array.length;
      this.$store.dispatch('analysis/selectTrips', this.array);
    },
  },
};
</script>

<style scoped>
.stats-view {
  border: black solid 1px;
  height: 100%;
}
.md-list-item {
  cursor: pointer;
}
</style>
