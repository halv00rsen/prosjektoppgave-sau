<template>
  <router-link :to="link">
    <md-list-item @click="close()">
      <md-icon>{{ icon }}</md-icon>
      <span class="md-list-item-text">
        {{ text }}
      </span>
    </md-list-item>
  </router-link>
</template>

<script>
export default {
  name: 'NavigationLink',
  props: {
    link: {
      type: Object,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    close: {
      required: true,
      type: Function,
    },
  },
};
</script>

<style scoped>
.md-list-item:hover {
  background-color: rgb(217, 249, 252);
}
</style>
