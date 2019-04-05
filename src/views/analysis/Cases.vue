
<template>
  <div
    v-if="!showMap">
    <h3>Brukerhistorier</h3>
    <md-list>
      <md-list-item
        v-for="(item, index) of cases"
        :key="index"
        @click="openCase(item)">
        <md-icon v-if="item.icon">
          {{ item.icon }}
        </md-icon>
        <md-icon v-else>
          navigation
        </md-icon>
        <span class="md-list-item-text">
          {{ item.text }}
        </span>
      </md-list-item>
    </md-list>
  </div>
  <div v-else>
    <h3>Velg område som skal søkes i</h3>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-70">
        <main-map
          :bounds.sync="bounds"/>
      </div>
      <div class="md-layout-item md-size-30">
        <md-datepicker
          v-model="startDate"
          md-immediately>
          <label>Dato fra</label>
        </md-datepicker>
        <md-datepicker
          v-model="endDate"
          md-immediately>
          <label>Dato til</label>
        </md-datepicker>
        <md-switch
          v-model="includeTripsInArea"
        >
          Inkluder alle turer som har vært innom området
          <md-avatar class="md-small">
            <md-icon>help_outline</md-icon>
            <md-tooltip
              md-direction="bottom"
              md-delay="300"
            >
              Om ikke valgt, må hele turen utelukkende ha vært i området
            </md-tooltip>
          </md-avatar>
        </md-switch>
        <br>
        <md-button
          :md-ripple="false"
          class="md-raised"
          @click="setBounds()">Gå videre</md-button>
        <md-button
          :md-ripple="false"
          class="md-raised"
          @click="cancleBounds()">Avbryt</md-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import MainMap from '@/components/map/MainMap.vue';

export default {
  name: 'Cases',
  components: {
    MainMap,
  },
  data: () => ({
    showMap: false,
    _case: undefined,
    bounds: undefined,
    includeTripsInArea: true,
    startDate: undefined,
    endDate: undefined,
  }),
  computed: {
    trips() {
      return this.$store.state.analysis.all;
    },
    cases() {
      const cases = [
        {
          text: 'Se den siste turen gjennomført',
          presetTrips: true,
          initialTrips: [this.trips[this.trips.length - 1]],
          header: 'Siste tur gjennomført',
          showObservedPoints: true,
          showPredators: true,
          showRoute: true,
          lockZoom: true,
          icon: 'last_page',
        },
        {
          text: 'Se alle turer som er gjort den siste uken',
          startDate: moment().subtract('7', 'days').startOf('day'),
          endDate: moment().endOf('day'),
          presetTrips: true,
          showRoute: true,
          icon: 'timeline',
        },
        {
          text: 'Se alle turer som er gjort den siste måneden',
          startDate: moment().subtract(1, 'months').startOf('day'),
          endDate: moment().endOf('day'),
          presetTrips: true,
          showRoute: false,
          icon: 'timeline',
        },
        {
          text: 'Se alle turer gjort i ' + moment().get('year'),
          startDate: moment().startOf('year'),
          endDate: moment().endOf('day'),
          presetTrips: true,
          showDensity: true,
          showRoute: false,
          icon: 'timeline',
        },
        {
          text: 'Se alle turer i et gitt område',
          header: 'Turer i et definert område',
          presetTrips: true,
          startDate: moment().startOf('year'),
          showRoute: true,
          setBounds: true,
          lockZoom: true,
          icon: 'map',
        },
        {
          text: 'Egendefinert oppsett',
          icon: 'build',
        },
      ];
      return cases;
    },
  },
  methods: {
    cancleBounds() {
      this._case = undefined;
      this.showMap = false;
    },
    openCase(item) {
      if (item.setBounds) {
        this._case = item;
        this.showMap = true;
        return;
      }
      this.$store.dispatch('analysis/setDates', {
        startDate: item.startDate,
        endDate: item.endDate,
      });
      this.$store.dispatch('analysis/setSelectedCase', {
        text: item.text,
        presetTrips: item.presetTrips,
        fixedTrips: item.initialTrips !== undefined,
        header: item.header !== undefined ? item.header : item.text,
      });
      if (item.showDensity) {
        this.$store.dispatch('analysis/setShowDensity', item.showDensity);
        this.$store.dispatch('analysis/setShowObservedPoints', false);
        this.$store.dispatch('analysis/setGroupTrips', false);
      } else {
        this.$store.dispatch('analysis/setShowObservedPoints', item.showObservedPoints);
        this.$store.dispatch('analysis/setGroupTrips', item.groupTrips);
      }
      this.$store.dispatch('analysis/setShowRoute', item.showRoute);
      if (item.initialTrips) {
        this.$store.dispatch('analysis/setInitialTrips', item.initialTrips);
      }
      this.$store.dispatch('analysis/setShowPredators', item.showPredators);
      this.$store.dispatch('analysis/setLockZoom', item.lockZoom);
      if (item.bounds) {
        if (this.startDate || this.endDate) {
          this.$store.dispatch('analysis/setDates', {
            startDate: this.startDate,
            endDate: this.endDate,
          });
        }
        this.$store.dispatch('analysis/selectTripsInBound', {
          bounds: item.bounds,
          inclusive: this.includeTripsInArea,
        });
      }
      this.$router.push('overview');
    },
    setBounds() {
      if (!this.bounds) {
        return;
      }
      this._case.bounds = {
        maxLat: this.bounds._northEast.lat,
        maxLng: this.bounds._northEast.lng,
        minLat: this.bounds._southWest.lat,
        minLng: this.bounds._southWest.lng,
      };
      this._case.setBounds = false;
      this.openCase(this._case);
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
