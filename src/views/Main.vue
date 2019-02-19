
<template>
  <div>
    <center>
      <md-button
        :md-ripple="false"
        class="md-raised"
        style="background-color: #eaf1fc;"
        @click="openTrip()">
        Innsamling
      </md-button>
      <br>
      <md-button
        :md-ripple="false"
        class="md-raised big"
        style="background-color: #eaf1fc;"
        @click="openAnalysis()">
        Analyse
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

