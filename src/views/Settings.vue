<template>
  <div>
    <md-button
      :md-ripple="false"
      class="md-raised"
      @click="removeEmptyTrips()">
      Fjern turer uten data
    </md-button>
    <br>
    <md-field>
      <md-input
        v-model="num"
        type="number"
      />
    </md-field>
    <md-button
      :md-ripple="false"
      class="md-raised"
      @click="tripForward()">
      Flytt alle turer {{ num }} dag(er) frem
    </md-button>
    <md-button
      :md-ripple="false"
      class="md-raised"
      @click="tripBackward()">
      Flytt alle turer {{ num }} dag(er) tilbake
    </md-button>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      num: 1,
    };
  },
  methods: {
    removeEmptyTrips() {
      this.$store.dispatch('trip/cleanEmptyTrips');
    },
    tripForward() {
      this.$store.dispatch('trip/moveTrips', {
        back: false,
        num: this.num,
      });
      this.$store.dispatch('application/setMessage',
        'Alle turer ble flyttet fram med ' + this.num + ' dag(er).');
    },
    tripBackward() {
      this.$store.dispatch('trip/moveTrips', {
        back: true,
        num: this.num,
      });
      this.$store.dispatch('application/setMessage',
        'Alle turer ble flyttet bakover med ' + this.num + ' dag(er)');
    },
  },
};
</script>

<style>

</style>
