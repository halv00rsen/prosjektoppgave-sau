<template>
  <div v-if="trip">
    <p v-if="trip.done">Navn: {{ trip.name }}</p>
    <p>Start: {{ Number(trip.startTime) | moment("YYYY.MM.DD - HH:mm:ss") }}</p>
    <p v-if="trip.endTime">Slutt: {{ Number(trip.endTime) | moment("YYYY.MM.DD - HH:mm:ss") }}</p>
    <SheepMap
      ref="sheepMap"
      :use-download="false"/>

    <md-button
      v-if="!trip.done"
      :md-ripple="false"
      class="md-raised"
      @click="openRegistration">
      Ny registrering
    </md-button>

    <md-button
      v-if="!trip.done"
      :md-ripple="false"
      class="md-raised"
      @click="showExitModal = true">
      Avslutt tur
    </md-button>

    <registration
      v-if="register"
      :detailed="detailedRegistration"
      :show="register"
      :close="closeRegistration"
      :save-registration="saveRegistration"/>

    <md-dialog-prompt
      :md-active.sync="showExitModal"
      v-model="name"
      md-title="Du er i ferd med å avslutte turen"
      md-input-placeholder="Skriv inn et navn på turen"
      md-confirm-text="Avslutt"
      md-cancel-text="Avbryt"
      @md-confirm="finishTrip"/>
  </div>
  <div v-else>
    404 - Fant ikke turen du leter etter!
  </div>
</template>

<script>
import L from 'leaflet';
import SheepMap from '@/components/SheepMap.vue';
import Registration from '@/components/Registration.vue';
import { mapState, } from 'vuex';

export default {
  name: 'Trip',
  components: {
    SheepMap,
    Registration,
  },
  data() {
    return {
      register: false,
      detailedRegistration: false,
      registrationPosition: null,
      showExitModal: false,
      name: '',
    };
  },
  computed: {
    ...mapState('trip', {
      trip: 'activeTrip',
    }),
  },
  methods: {
    finishTrip() {
      this.$store.dispatch('trip/setActiveTripDone', this.name);
    },
    openRegistration() {
      const observation = L.latLng(this.$refs.sheepMap.center);
      const position = L.latLng(this.$store.state.trip.currentPosition);
      this.registrationPosition = this.$refs.sheepMap.center;
      this.detailedRegistration = observation.distanceTo(position) < 300;
      this.register = true;
    },
    saveRegistration(data) {
      data.position = {
        lng: this.registrationPosition.lng,
        lat: this.registrationPosition.lat,
      };
      this.$store.dispatch('trip/registerObservation', data).then(() => {
        this.register = false;
      });
    },
    closeRegistration() {
      this.register = false;
    },
  },
};
</script>
