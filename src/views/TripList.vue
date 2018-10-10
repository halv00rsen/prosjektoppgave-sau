
<template>
  <div>
    <md-dialog :md-active.sync="showDialog" v-bind:md-fullscreen="false">
      <md-dialog-title>
        Er du sikker på at du vil slette denne turen?
      </md-dialog-title>
      <md-dialog-actions>
        <md-button class="md-danger" @click="deleteTrip(deleteIndex); showDialog=false;">Ja jeg er sikker</md-button>
        <md-button class="md-primary" @click="showDialog=false">Avbryt</md-button>
      </md-dialog-actions>
    </md-dialog>
    <div v-if="!trips.length">
      <p>Du har ikke registrert noen turer enda!</p>
    </div>
    <md-card
        v-for="(trip, index) in trips"
        :key="trip.id"
        class="md-double-line">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">{{ Number(trip.startTime) | moment("YYYY.MM.DD - HH:mm:ss") }}</div>
          <div class="md-subhead" v-if="trip.name">{{trip.name}}</div>
        </md-card-header-text>
      </md-card-header>
      <md-card-content>
        <p>
          Start: {{ Number(trip.startTime) | moment("YYYY.MM.DD - HH:mm:ss") }}
        </p>
        <p v-if="trip.endTime">
        Slutt: {{ Number(trip.endTime) | moment("YYYY.MM.DD - HH:mm:ss") }}
        </p>
      </md-card-content>
      <md-card-actions>
        <md-button @click="goToTrip(trip.id)">
          {{ trip.done ? 'Åpne' : 'Gjør ferdig turen'}}
        </md-button>
        <md-button @click="openDeleteDialog(index)">Slett</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
import {
  mapState, mapActions,
} from 'vuex';

export default {
  name: 'TripList',
  data() {
    return {
      tripName: '',
      showDialog: false,
      deleteIndex: undefined,
    }
  },
  computed: {
    ...mapState('trip', {
      trips: state => state.all,
    }),
    // sortedTrips
  },
  methods: {
    ...mapActions('trip', [
      'deleteTrip',
    ]),
    openDeleteDialog(index) {
      this.deleteIndex = index;
      this.showDialog = true;
    },
    goToTrip(id) {
      this.$store.dispatch('trip/setActiveTrip', id).then(() => {
        this.$router.push({ name: 'trip', params: { tripId: id, }, });
      });
    },
  },
}
</script>

<style scoped>
.md-list {
  width: 320px;
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  border: 1px solid rgba(#000, .12);
}
.md-list-item:hover {
  background-color: rgba(#999, .12);
}

.deleteRow {
  cursor: pointer;
}

.md-card-header {
  min-height: 5em;
}

.md-card {
  width: 320px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}
</style>
