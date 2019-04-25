
<template>
  <div>
    <center>
      <md-button
        :md-ripple="false"
        class="md-raised"
        style="background-color: #eaf1fc;"
        @click="openTrip()"
      >
        Innsamling
      </md-button>
      <md-button
        v-if="canAnalyse"
        :md-ripple="false"
        class="md-raised big"
        style="background-color: #eaf1fc;"
        @click="openAnalysis()"
      >
        Analyse
      </md-button>
      <md-button
        v-else
        class="md-raised big"
        style="background-color: #eaf1fc;"
        disabled
      >
        Analyse
      </md-button>
      <br>
      <md-button
        :md-ripple="false"
        class="md-raised"
        style="background-color: #eaf1fc;"
        @click="openMock()"
      >
        Generer tur manuelt
      </md-button>
      <md-button
        :md-ripple="false"
        class="md-raised"
        style="background-color: #eaf1fc;"
        @click="editTrip()"
      >
        Gjør endringer på tur
      </md-button>
      <br>
      <md-button
        :md-ripple="false"
        class="md-raised"
        style="background-color: #eaf1fc;"
        @click="openSettings()"
      >
        Instillinger
      </md-button>
      <md-button
        @click="openTest()"
      >
        Testmap
      </md-button>
    </center>
  </div>
</template>

<script>
export default {
  name: 'Main',
  computed: {
    canAnalyse() {
      return this.$store.state.trip.all.length != 0;
    },
  },
  methods: {
    openTrip() {
      this.$router.push({ name: 'home', });
    },
    openAnalysis() {
      this.$router.push({ name: 'cases', });
    },
    openMock() {
      this.$router.push({ name: 'mock', });
    },
    editTrip() {
      this.$router.push({ name: 'editTrip', });
    },
    openSettings() {
      this.$router.push({ name: 'mainSettings', });
    },
    openTest() {
      this.$router.push({ name: 'maptest', });
    },
  },
};
</script>

<style scoped>
.md-button {
  width: 20em;
  margin-top: 4em;
  height: 10em;
}
</style>
