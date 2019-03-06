
<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-layout md-large-size-50 md-medium-size-50 md-small-size-50 md-xsmall-size-100 analysis-column">
      <div class="md-layout-item md-large-size-40">
        <md-datepicker
          v-model="startDate"
          :md-disabled-dates="disabledFrom"
          md-immediately>
          <label>Dato fra</label>
        </md-datepicker>
      </div>
      <div class="md-layout-item md-large-size-40">
        <md-datepicker
          v-model="endDate"
          :md-disabled-dates="disabledTo"
          md-immediately>
          <label>Dato til</label>
        </md-datepicker>
      </div>
      <div class="md-layout-item">
        <md-button
          class="md-dense md-icon-button"
          @click="setDates()">
          <md-icon>date_range</md-icon>
        </md-button>
        <md-button
          class="md-dense md-icon-button"
          @click="clearDates()">
          <md-icon>delete</md-icon>
        </md-button>
      </div>
      <div class="md-layout-item md-size-100">
        <main-map/>
        <!-- <SheepMap
          v-if="!useDensity"
          ref="sheepMap"
          :use-download="false"
          :analysis-view="true"/>
        <TestMap
          v-else/> -->
      </div>
    </div>
    <div class="md-layout-item md-large-size-50 md-medium-size-50 md-small-size-50 md-xsmall-size-100 analysis-column">
      <SideView/>
    </div>
  </div>
</template>

<script>
import SheepMap from '@/components/SheepMap.vue';
import SideView from '@/components/analysis/SideView.vue';
import TestMap from '@/components/map/TestMap.vue';
import MainMap from '@/components/map/MainMap.vue';

export default {
  name: 'Overview',
  components: {
    SheepMap,
    SideView,
    TestMap,
    MainMap,
  },
  data: () => ({
    startDate: undefined,
    endDate: undefined,
  }),
  computed: {
    validDates() {
      return (!this.startDate || !this.endDate) || this.startDate <= this.endDate;
    },
    useDensity() {
      return this.$store.state.analysis.settings.showDensity;
    },
  },
  methods: {
    disabledFrom(date) {
      const now = new Date();
      return date > now || (this.endDate && date > this.endDate);
    },
    disabledTo(date) {
      const now = new Date();
      return date > now || date < this.startDate;
    },
    setDates() {
      this.$store.dispatch('analysis/setDates', this.startDate, this.endDate);
    },
    clearDates() {
      this.startDate = undefined;
      this.endDate = undefined;
      this.setDates();
    },

  },
};
</script>

<style scoped>

</style>

<style>
.md-datepicker-dialog {
  min-height: 286px;
  max-height: 286px;
}

.analysis-column {
  height: 80vh;
}
</style>
