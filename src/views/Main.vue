
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
      <br>
      <md-button
        :md-ripple="false"
        class="md-raised big"
        style="background-color: #eaf1fc;"
        @click="openAnalysis()"
      >
        Analyse
      </md-button>
      <md-button
        :md-ripple="false"
        class="md-raised"
        style="background-color: #eaf1fc;"
        @click="openMock()"
      >
        Lag testdata
      </md-button>
    </center>
  </div>
</template>

<script>
export default {
  name: 'Main',
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

