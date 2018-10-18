<template>
  <md-snackbar
    :md-position="'left'"
    :md-duration="duration"
    :md-active.sync="open"
    md-persistent>
    <span>{{ message }}</span>
    <md-button
      class="md-primary"
      @click="close">Lukk</md-button>
  </md-snackbar>
</template>

<script>
export default {
  name: 'AlertBox',
  props: {
    closeCallback: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      duration: 5000,
    };
  },
  computed: {
    message() {
      return this.$store.state.application.message;
    },
    open: {
      get() {
        return this.$store.state.application.messageOpen;
      },
      set(val) {
        if (!val) {
          this.$store.dispatch('application/closeMessage');
        }
      },
    },
  },
  methods: {
    close() {
      this.open = false;
      if (this.closeCallback) {
        this.closeCallback();
      }
    },
  },
};
</script>
