<template>
  <div>
    <SheepMap/>
  </div>
</template>

<script>
import SheepMap from '@/components/SheepMap.vue';

export default {
  name: 'Maps',
  components: {
    SheepMap,
  },
};
</script>

<style>
.leaflet-fake-icon-image-2x {
  background-image: url(../../../node_modules/leaflet/dist/images/marker-icon-2x.png);
}
.leaflet-fake-icon-shadow {
  background-image: url(../../../node_modules/leaflet/dist/images/marker-shadow.png);
}
@import "../../../node_modules/leaflet/dist/leaflet.css";
</style>
