
<template>
  <div
    v-if="!showMap">
    <md-button
      :style="getButtonClass(false)"
      class="md-icon-button"
      @click="showList = false"
    >
      <md-icon>view_quilt</md-icon>
    </md-button>
    <md-button
      :style="getButtonClass(true)"
      class="md-icon-button"
      @click="showList = true"
    >
      <md-icon>view_list</md-icon>
    </md-button>
    <br>
    <div
      v-if="!showList"
      class="md-layout md-gutter"
    >
      <case-list
        :cases="timeCases"
        :use-icons="true"
        icon="timeline"
        title="Tidsbasert"
        tooltip="Vil hente turer basert på en tidsrestriksjon"
        @clickedCase="openCase($event)"
      />
      <case-list
        :cases="mapCases"
        :use-icons="true"
        icon="map"
        title="Områdebasert"
        tooltip="Man velger område for så at søk etter scenario blir gjort"
        @clickedCase="openCase($event)"
      />
      <case-list
        :cases="comparisonCases"
        icon="compare_arrows"
        title="Sammenligninger"
        @clickedCase="openCase($event)"
      />
      <case-list
        :cases="otherCases"
        :use-icons="true"
        icon="build"
        title="Annet"
        @clickedCase="openCase($event)"
      />
    </div>
    <md-list v-else>
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
    <h3>Zoom inn på ønsket område for å gjøre søk</h3>
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
              Om ikke valgt, må hele turen utelukkende ha vært i området valgt
            </md-tooltip>
          </md-avatar>
        </md-switch>
        <br>
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
import CaseList from '@/components/CaseList.vue';
import { mapState, } from 'vuex';

export default {
  name: 'Cases',
  components: {
    MainMap,
    CaseList,
  },
  data: () => ({
    showMap: false,
    _case: undefined,
    bounds: undefined,
    includeTripsInArea: true,
    startDate: undefined,
    endDate: undefined,
    showList: false,
    timeCases: [
      {
        text: 'Turer fra den siste uken',
        startDate: moment().subtract('7', 'days').startOf('day'),
        endDate: moment().endOf('day'),
        presetTrips: true,
        showRoute: true,
        showPredators: true,
        showObservedPoints: true,
        icon: 'directions_walk',
      },
      {
        text: 'Turer fra denne måneden',
        startDate: moment().subtract(1, 'months').startOf('day'),
        endDate: moment().endOf('day'),
        presetTrips: true,
        showRoute: false,
        showPredators: true,
        icon: 'directions_walk',
        mainView: 'pointSizing',
      },
      {
        text: 'Tettheten av sauer i ' + moment().get('year'),
        startDate: moment().startOf('year'),
        endDate: moment().endOf('day'),
        presetTrips: true,
        showPredators: false,
        showRoute: false,
        icon: 'directions_walk',
        mainView: 'showHeatmap',
      },
    ],
    mapCases: [
      {
        text: 'Observasjoner i et område',
        header: 'Observasjoner i et definert område',
        presetTrips: true,
        startDate: moment().startOf('year'),
        showRoute: true,
        setBounds: true,
        lockZoom: true,
        icon: 'directions_walk',
      },
      {
        text: 'Rovdyr i et område',
        header: 'Rovdyr observert i området',
        icon: 'pets',
        presetTrips: true,
        showPredators: true,
        showObservations: false,
        setBounds: true,
        nina: true,
      },
    ],
    comparisonCases: [
      {
        text: 'Sammenlign årets data med fjorårets i et gitt område',
        header: 'Sammenligning med fjorårets data',
        icon: 'compare_arrows',
        setBounds: true,
        comparison: true,
        presetTrips: true,
      },
      {
        text: 'Sammenlign årets data med fjorårets i en tidsperiode',
        header: 'Sammenligning med fjorårets data',
        icon: 'compare_arrows',
        comparison: true,
      },
    ],
  }),
  computed: {
    ...mapState('analysis', {
      trips: 'all',
    }),
    otherCases() {
      return [
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
          text: 'Egendefinert oppsett',
          icon: 'build',
        },
      ];
    },
    cases() {
      const cases = [
        ...this.timeCases,
        ...this.mapCases,
        ...this.comparisonCases,
        ...this.otherCases,
        // Add disabling of filters, which isn't interesting for the given case
        // Når man velger fra et område, legg inn en graf fra highcharts som viser observasjoner gjort over en graf (?) - som tenkt fra teorien
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
        bounds: item.bounds,
      });
      if (item.comparison) {
        this.$store.dispatch('analysis/setComparison', true);
      }
      this.$store.dispatch('analysis/setMainView', item.mainView);
      this.$store.dispatch('analysis/setShowObservedPoints', item.showObservedPoints);
      this.$store.dispatch('analysis/setGroupTrips', item.groupTrips);
      this.$store.dispatch('analysis/setShowRoute', item.showRoute);
      if (!item.showObservations && item.showObservations !== undefined) {
        this.$store.dispatch('analysis/setShowObservations', false);
      }
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
      if (item.nibio) {
        this.$store.dispatch('analysis/setShowNibio', true);
      }
      if (item.nina) {
        this.$store.dispatch('analysis/setShowNina', true);
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
    getButtonClass(isList) {
      if (!isList && !this.showList || isList && this.showList) {
        return 'background-color:#d1d1d1';
      }
      return '';
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
