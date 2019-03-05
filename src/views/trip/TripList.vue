
<template>
  <div>
    <md-dialog
      :md-active.sync="showDialog"
      :md-fullscreen="false">
      <md-dialog-title>
        Er du sikker på at du vil slette denne turen?
      </md-dialog-title>
      <md-dialog-actions>
        <md-button
          class="md-danger"
          @click="deleteTrip(deleteIndex); showDialog=false;">Ja jeg er sikker</md-button>
        <md-button
          class="md-primary"
          @click="showDialog=false">Avbryt</md-button>
      </md-dialog-actions>
    </md-dialog>
    <div v-if="!trips.length">
      <p>Du har ikke registrert noen turer enda!</p>
    </div>
    <md-switch
      v-model="serverView"
      :change="loadServerData()">Serverturer</md-switch>
    <br>
    <md-card
      v-for="(trip, index) in (serverView ? serverTrips : trips)"
      :key="trip.id"
      class="md-double-line">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">{{ trip.name }}</div>
          <!-- <div
            v-if="trip.name"
            class="md-subhead"></div> -->
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
        <md-button
          v-if="trip.done && !serverView"
          @click="upload(trip)">
          Sync
        </md-button>
        <md-button @click="goToTrip(trip.id)">
          {{ trip.done ? 'Åpne' : 'Gjør ferdig turen' }}
        </md-button>
        <md-button
          v-if="!serverView"
          @click="openDeleteDialog(index)">Slett</md-button>
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
      apiUrl: process.env.VUE_APP_API_ENDPOINT,
      serverDataLoaded: false,
      serverView: false,
    };
  },
  computed: {
    ...mapState('trip', {
      trips: state => state.all,
    }),
    serverTrips() {
      return this.$store.getters['trip/serverTrips'];
    },
    apiAuthToken() {
      return this.$store.getters['application/getApiToken'];
    },
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
      this.$store.dispatch(this.serverView ? 'trip/setActiveTripServer' : 'trip/setActiveTrip', id).then(() => {
        this.$router.push({ name: 'trip', params: { tripId: id, }, });
      });
    },
    upload(trip) {
      let apiAuthToken = this.apiAuthToken();
      if (!this.apiAuthToken()) {
        apiAuthToken = 'Basic ' + btoa('bruker:' + prompt('Passord:'));
        this.$store.dispatch('application/setApiToken', apiAuthToken);
      }
      this.$http.post(this.apiUrl + 'trip', trip, {
        headers: {
          'Authorization': apiAuthToken,
        },
      }).then((response) => {
        console.log(response);
        this.$store.dispatch('application/setMessage', 'Turen ble opplastet');
      }).catch((error) => {
        console.log(error);
        this.$store.dispatch('application/setApiToken', undefined);
        this.$store.dispatch('application/setMessage', 'Noe feil skjedde i opplasting');
      });
    },
    loadServerData() {
      console.log('load server data');
      this.$store.dispatch('trip/setServerView', this.serverView);
      if (!this.serverView || this.serverDataLoaded) {
        return;
      }
      let apiAuthToken = this.apiAuthToken();
      if (!this.apiAuthToken()) {
        apiAuthToken = 'Basic ' + btoa('bruker:' + prompt('Passord:'));
        console.log(apiAuthToken);
        this.$store.dispatch('application/setApiToken', apiAuthToken);
      }
      this.$http.get(this.apiUrl + 'trip', {
        headers: {
          'Authorization': apiAuthToken,
        },
      }).then((response) => {
        response.data.forEach((elem) => {
          elem.done = true;
        });
        this.$store.dispatch('trip/setServerTrips', response.data);
        this.serverDataLoaded = true;
        this.$store.dispatch('application/setMessage', 'Turer fra server innlastet');
      }).catch((error) => {
        console.log('ERRORRRR*');
        console.log(error);
        this.$store.dispatch('application/setApiToken', undefined);
        this.$store.dispatch('application/setMessage', 'Noe feil skjedde i nedlasting');
        this.serverView = false;
      });
    },
  },
};
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
