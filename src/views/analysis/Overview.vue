
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
        <highcharts
          :options="chartOptions"
          style="width: 100%;"
        />
      </div>
      <div class="md-layout-item md-size-100">
        <analysis-map ref="map"/>
        <div v-if="loadingData">
          <md-progress-bar md-mode="indeterminate"/>
        </div>
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

import Highcharts from 'highcharts';
import timeline from 'highcharts/modules/timeline';
import { Chart, } from 'highcharts-vue';
import { mapState, } from 'vuex';

import SideView from '@/components/analysis/SideView.vue';
import AnalysisMap from '@/components/map/AnalysisMap.vue';

timeline(Highcharts);

export default {
  name: 'Overview',
  components: {
    SideView,
    AnalysisMap,
    highcharts: Chart,
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
      'loadingData',
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
    chartOptions() {
      const config = {
        chart: {
          zoomType: 'x',
          type: 'timeline',
          margin: 0,
        },
        xAxis: {
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        title: {
          text: '',
          floating: true,
        },
        series: [
          {
            dataLabels: {
              enabled: false,
            },
            events: {
              click: this.clickTimeline,
            },
            data: [],
          },
        ],
      };
      if (this.selectedCase.detailedTimeline) {
        config.xAxis.type = 'datetime';
        config.series[0].marker = {
          symbol: 'circle',
        };
      }
      for (let trip of this.selectedTrips) {
        const elem = {
          name: moment(trip.startTime).format('YYYY.MM.DD') + ' - ' + trip.name,
          description: 'Sau: ' + trip.numSheep,
          color: trip.color,
          bounds: trip.getBounds(),
        };
        if (this.selectedCase.detailedTimeline) {
          elem.x = new Date(trip.startTime);
        }
        config.series[0].data.push(elem);
      }
      return config;
    },
  },
  watch: {
    tripIndex(index) {
      this.$store.dispatch('analysis/setTimeTrip', this.selectedTrips[index]);
      this.$store.dispatch('analysis/setFitBounds', this.selectedTrips[index].getBounds());
    },
    numTrips() {
      this.tripIndex = 0;
    },
  },
  mounted() {
    if (this.settings.showTime) {
      this.$store.dispatch('analysis/setTimeTrip', this.selectedTrips[0]);
      this.$store.dispatch('analysis/setFitBounds', this.selectedTrips[0].getBounds());
    }
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
    clickTimeline(event) {
      this.$store.dispatch('analysis/setFitBounds', event.point.options.bounds);
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
  height: 82vh;
}
</style>
