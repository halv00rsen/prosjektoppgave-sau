<template>
  <div v-if="trip">
    <p>Navn: {{trip.name}}</p>
    <p>Start: {{ Number(trip.startTime) | moment("YYYY.MM.DD - HH:mm:ss") }}</p>
    <p v-if="trip.endTime">Slutt: {{ Number(trip.endTime) | moment("YYYY.MM.DD - HH:mm:ss") }}</p>
    <SheepMap ref="sheepMap"
      v-bind:useDownload="false">
    </SheepMap>

    <md-button v-if="!trip.done" class="md-raised" :md-ripple="false" @click="openRegistration">
      Ny registrering
    </md-button>

    <md-button v-if="!trip.done" class="md-raised" :md-ripple="false" @click="showExitModal = true">
      Avslutt tur
    </md-button>

    <registration
      v-if="register"
      :detailed="detailedRegistration"
      v-bind:show="register"
      :close="closeRegistration"
      :saveRegistration="saveRegistration"/>

    <md-dialog-confirm
      :md-active.sync="showExitModal"
      md-title="Er du sikker på at du vil avslutte turen?"
      md-content="Det vil ikke være mulig å gjenåpne denne turen"
      md-confirm-text="Ja"
      md-cancel-text="Nei"
      @md-confirm="finishTrip"
      />
  </div>
  <div v-else>
    404 - Fant ikke turen du leter etter!
  </div>
</template>

<script>
import L from 'leaflet';
import SheepMap from '@/components/SheepMap.vue';
import Registration from '@/components/Registration.vue';

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
    }
  },
  methods: {
    finishTrip() {
      this.$store.dispatch('trip/setActiveTripDone');
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
  created() {
    if (!this.$store.state.activeTrip) {
      this.$store.dispatch('trip/setActiveTrip', this.$route.params.tripId).then((data) => {
      });
    }
  },
  computed: {
    trip() {
      return this.$store.state.trip.activeTrip;
    },
  },
}
</script>
