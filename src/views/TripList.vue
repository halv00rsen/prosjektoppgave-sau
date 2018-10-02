
<template>
  <div>
    <md-list
      v-for="(trip, index) in trips"
      :key="trip.date"
      class="md-double-line">

      <md-subheader>
        {{ Number(trip.date) | moment("YYYY.MM.DD - HH:mm:ss") }}
      </md-subheader>

      <md-list-item @click="deleteTrip(index)" class="deleteRow">
        <md-icon>delete</md-icon>
        <span class="md-list-item-text">Trash</span>
      </md-list-item>

      <md-divider></md-divider>

      <md-list-item>
        <div class="md-list-item-text">
          <span>Info om turen</span>
          <span>{{trip.name}}</span>
        </div>
      </md-list-item>
    </md-list>
    <md-field>
      <label>Info om turen</label>
      <md-input v-model="tripName"></md-input>
    </md-field>
    <md-button class="md-raised" @click="addTrip">Lagre</md-button>
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
    }
  },
  created() {
    console.log('created trip list');
    this.$store.dispatch('trip/loadTrips');
  },
  computed: {
    ...mapState('trip', {
      trips: state => state.all,
    }),
  },
  methods: {
    ...mapActions('trip', [
      'deleteTrip',
    ]),
    // ...mapMutations('trip', [

    // ]),
    addTrip(event) {
      this.$store.dispatch('trip/saveTrip', this.tripName).then(() => {
        this.tripName = '';
      });
    },
    // deleteTrip(index, id) {
    //   console.log(id + '  ' + index);
    // }
  },
}
</script>

<style scoped>
/* li {
  margin-right: 3em;
  list-style-type: none;
  padding: 1em;
  border: 0.1em solid gray;
} */

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
</style>
