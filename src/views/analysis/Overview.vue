
<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-layout md-size-70">
      <h3>{{ selectedCase.header }}</h3>
    </div>
    <div class="md-layout-item md-layout md-size-30">
      <router-link :to="{ name: 'cases', }">Tilbake</router-link>
    </div>
    <div class="md-layout-item md-layout md-large-size-70 md-medium-size-60 md-small-size-50 md-xsmall-size-100 analysis-column">
      <div v-if="settings.showTime">
        <md-button
          class="md-icon-button"
          @click="editTripIndex(-1)"
        >
          <md-icon>navigate_before</md-icon>
        </md-button>
        <input
          v-if="settings.showTime"
          v-model.number="tripIndex"
          :max="numTrips"
          min="0"
          type="range">
        <md-button
          class="md-icon-button"
          @click="editTripIndex(1)"
        >
          <md-icon>navigate_next</md-icon>
        </md-button>
      </div>
      <div
        v-else-if="!selectedCase.fixedTrips"
        class="md-layout-item md-layout md-large-size-100">
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
      </div>
      <div class="md-layout-item md-size-100">
        <analysis-map ref="map"/>
        <!-- <md-button @click="exportGeoJson()">
          Eksporter GeoJson
        </md-button> -->
      </div>
    </div>
    <div class="md-layout-item md-large-size-30 md-medium-size-40 md-small-size-50 md-xsmall-size-100 analysis-column">
      <SideView/>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import SideView from '@/components/analysis/SideView.vue';
import AnalysisMap from '@/components/map/AnalysisMap.vue';
import { mapState, } from 'vuex';

export default {
  name: 'Overview',
  components: {
    SideView,
    AnalysisMap,
  },
  data: () => ({
    startDate: undefined,
    endDate: undefined,
    map: undefined,
    tripIndex: 0,
  }),
  computed: {
    ...mapState('analysis', [
      'settings',
      'selectedCase',
      'dateFrom',
      'dateTo',
      'selectedTrips',
    ]),
    numTrips() {
      return this.selectedTrips.length - 1;
    },
    validDates() {
      return (!this.startDate || !this.endDate) || this.startDate <= this.endDate;
    },
    storeStartDate() {
      if (this.dateFrom) {
        return moment(this.dateFrom).format('LL');
      }
      return undefined;
    },
    storeEndDate() {
      if (this.dateTo) {
        return moment(this.dateTo).format('LL');
      }
      return undefined;
    },
  },
  watch: {
    tripIndex(index) {
      this.$store.dispatch('analysis/setTimeTrip', index);
    },
    numTrips() {
      this.tripIndex = 0;
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
    exportGeoJson() {
      const json = this.$refs.map.getGeoJSON();
      const url = window.URL.createObjectURL(new Blob([JSON.stringify(json)]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'geodata.json'); //or any other extension
      document.body.appendChild(link);
      link.click();
    },
    editTripIndex(val) {
      if (this.tripIndex + val >= 0 && this.tripIndex + val <= this.numTrips) {
        this.tripIndex = this.tripIndex + val;
      }
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
