<template>
  <div>
    <h3>Instillinger</h3>
    <!-- <router-link :to="{ name: 'cases', }">Tilbake</router-link> -->
    <md-button @click="goBack()">Tilbake</md-button>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-50">
        <h4>Alle turer</h4>
        <md-list>
          <md-list-item
            v-for="(trip, index) of trips"
            :key="index"
            @click="openTrip(trip, index)"
          >
            <span
              :style="'color: ' + trip.color"
              class="md-list-item-text"
            >
              {{ Number(trip.startTime) | moment("YYYY.MM.DD") }}
              -
              {{ trip.name }}
            </span>
          </md-list-item>
        </md-list>
      </div>
      <div
        v-if="trip"
        class="md-layout-item md-size-50">
        <h4>Valgt tur</h4>
        <p>Navn: {{ trip.name }}</p>
        <p>Antall observasjoner: {{ trip.observations.length }}</p>
        <p>Antall posisjoner: {{ trip.positions.length }}</p>
        <chrome-picker
          v-model="color"
          @input="updateValue"/>
      </div>
      <div
        v-else
        class="md-layout-item md-size-50">
        <h4>Ingen tur valgt</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, } from 'vuex';
import { Chrome, } from 'vue-color';

export default {
  name: 'AnalysisSettings',
  components: {
    'chrome-picker': Chrome,
  },
  data: () => {
    return {
      trip: undefined,
      color: undefined,
      index: undefined,
    };
  },
  computed: {
    ...mapState('analysis', {
      trips: 'all',
    }),
  },
  methods: {
    openTrip(trip, index) {
      this.trip = trip;
      this.color = trip.color;
      this.index = index;
    },
    saveChanges() {
      this.$store.dispatch('analysis/editTripVisualInfo', {
        index: this.index,
        color: this.color.hex,
      });
    },
    updateValue(color) {
      this.$store.dispatch('analysis/editTripVisualInfo', {
        index: this.index,
        color: color.hex,
      });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>

</style>
