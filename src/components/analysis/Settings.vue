
<template>
  <div>
    <md-list>
      <list-switch
        dispatch="setAutomaticZoom"
        variable="automaticZoom"
        text="Automatisk zoom"/>
      <md-list-item>
        <md-switch v-model="useNibio"/>
        <span class="md-list-item-text">
          Vis data fra NIBIO
        </span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
import ListSwitch from '@/components/analysis/ListSwitch.vue';

export default {
  name: 'Settings',
  components: {
    ListSwitch,
  },
  data: () => ({
    useNibio: false,
  }),
};
</script>
