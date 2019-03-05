
<template>
  <div class="stats-view md-scrollbar">
    <md-tabs
      style="height: 79vh;">
      <md-tab
        id="tab-statistics"
        md-label="Statistikk">
        <div class="side-view-content md-scrollbar">
          <Statistics/>
        </div>
      </md-tab>
      <md-tab
        id="tab-trips"
        md-label="Turer">
        <div class="side-view-content md-scrollbar">
          <Trips/>
        </div>
      </md-tab>
      <md-tab
        id="tab-type-view"
        md-label="Visning">
        <div class="side-view-content md-scrollbar">
          <Filters/>
        </div>
      </md-tab>
      <md-tab
        id="tab-settings-view"
        md-label="Instillinger">
        <div class="side-view-content md-scrollbar">
          <Settings/>
        </div>
      </md-tab>
    </md-tabs>
  </div>
</template>

<script>
import Statistics from '@/components/analysis/Statistics.vue';
import Settings from '@/components/analysis/Settings.vue';
import Trips from '@/components/analysis/Trips.vue';
import Filters from '@/components/analysis/Filters.vue';

export default {
  name: 'TabView',
  components: {
    Settings,
    Trips,
    Statistics,
    Filters,
  },
  data: () => ({

  }),
};
</script>

<style>
.side-view-content {
  height: 72vh;
  overflow-y: auto;
}
</style>

<style scoped>
.stats-view {
  border: black solid 1px;
}
</style>
