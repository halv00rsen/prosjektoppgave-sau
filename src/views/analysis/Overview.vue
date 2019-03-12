
<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-layout md-size-70">
      <h3>{{ selectedCase.text }}</h3>
    </div>
    <div class="md-layout-item md-layout md-size-30">
      <router-link :to="{ name: 'cases', }">Tilbake</router-link>
    </div>
    <div class="md-layout-item md-layout md-large-size-50 md-medium-size-50 md-small-size-50 md-xsmall-size-100 analysis-column">
      <div class="md-layout-item md-large-size-40">
        <md-datepicker
          v-if="!storeStartDate"
          v-model="startDate"
          :md-disabled-dates="disabledFrom"
          md-immediately>
          <label>Dato fra</label>
        </md-datepicker>
        <md-field v-else>
          <label>Dato fra</label>
          <md-input
            v-model="storeStartDate"
            disabled
          />
        </md-field>
      </div>
      <div class="md-layout-item md-large-size-40">
        <md-datepicker
          v-if="!storeEndDate"
          v-model="endDate"
          :md-disabled-dates="disabledTo"
          md-immediately>
          <label>Dato til</label>
        </md-datepicker>
        <md-field v-else>
          <label>Dato til</label>
          <md-input
            v-model="storeEndDate"
            disabled
          />
        </md-field>
      </div>
      <div
        v-if="!storeEndDate && !storeStartDate"
        class="md-layout-item">
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
      </div>
    </div>
    <div class="md-layout-item md-large-size-50 md-medium-size-50 md-small-size-50 md-xsmall-size-100 analysis-column">
      <SideView/>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import SideView from '@/components/analysis/SideView.vue';
import MainMap from '@/components/map/MainMap.vue';

export default {
  name: 'Overview',
  components: {
    SideView,
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
    selectedCase() {
      return this.$store.state.analysis.selectedCase;
    },
    storeStartDate() {
      const date = this.$store.state.analysis.dateFrom;
      if (date) {
        return moment(date).format('LL');
      }
      return undefined;
    },
    storeEndDate() {
      const date = this.$store.state.analysis.dateTo;
      if (date) {
        return moment(date).format('LL');
      }
      return undefined;
    },
  },
  beforeDestroy() {
    this.$store.dispatch('analysis/reset');
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
      this.$store.dispatch('analysis/setDates', {
        startDate: this.startDate,
        endDate: this.endDate,
      });
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
