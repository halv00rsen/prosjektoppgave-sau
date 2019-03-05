
<template>
  <md-list-item>
    <md-switch v-model="model"/>
    <span class="md-list-item-text">
      {{ text }}
    </span>
  </md-list-item>
</template>

<script>
export default {
  name: 'ListSwitch',
  props: {
    dispatch: {
      type: String,
      required: true,
    },
    variable: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  computed: {
    model: {
      get() {
        return this.$store.state.analysis.settings[this.variable];
      },
      set(value) {
        this.$store.dispatch('analysis/' + this.dispatch, value);
      },
    },
  },
};
</script>

<style scoped>
.md-list-item-text {
  cursor: pointer;
}
</style>
