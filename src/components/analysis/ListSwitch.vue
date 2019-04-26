
<template>
  <md-list-item>
    <md-switch
      v-model="model"
      :disabled="disabled"/>
    <span class="md-list-item-text">
      {{ text }}
    </span>
  </md-list-item>
</template>

<script>
import { mapState, } from 'vuex';

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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('analysis', [
      'settings',
    ]),
    model: {
      get() {
        return this.settings[this.variable];
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
