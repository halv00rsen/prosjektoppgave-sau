
<template>
  <div>
    <md-button
      :md-ripple="false"
      class="md-raised"
      @click="openTrip()">
      Innsamling
    </md-button>
    <md-button
      :md-ripple="false"
      class="md-raised"
      @click="openAnalysis()">
      Analyse
    </md-button>
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

