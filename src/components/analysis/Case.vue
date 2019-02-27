
<template>
  <md-list-item @click="openCase">
    {{ text }}
  </md-list-item>
</template>

<script>
export default {
  name: 'Case',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  methods: {
    openCase() {
      this.$router.push('overview');
    },
  },
};
</script>

<style scoped>

.md-list-item {
  border: black solid 1px;
  margin: 1em;
}

</style>
