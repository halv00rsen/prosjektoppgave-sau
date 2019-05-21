
<template>
  <div style="display: none;">
    <slot v-if="ready"/>
  </div>
</template>

<script>
import { DomEvent, } from 'leaflet';
import { findRealParent, propsBinder, } from 'vue2-leaflet';

import 'heatmap.js';
import HeatmapOverlay from '../../../node_modules/heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap';

export default {
  name: 'Heatmap',
  props: {
    latLngs: {
      type: Array,
      required: true,
    },
    max: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      ready: false,
      cfg: {
        // radius: 2,
        // maxOpacity: .8,
        // scaleRadius: true,
        // useLocalExtrema: true,
        maxOpacity: 0.5,
        minOpacity: 0,
        // gradient: {0.10: 'red', 0.25: 'orange', 0.55: 'lime', 0.85: 'green',},
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count',
      },
      mapObject: undefined,
    };
  },
  watch: {
    latLngs() {
      this.mapObject.setData({
        data: this.latLngs,
        max: this.max,
        min: 0,
      });
    },
  },
  mounted() {
    this.mapObject = new HeatmapOverlay(this.cfg);
    DomEvent.on(this.mapObject, this.$listeners);
    propsBinder(this, this.mapObject, this.props);
    this.ready = true;
    this.parentContainer = findRealParent(this.$parent);
    this.parentContainer.addLayer(this);
    this.mapObject.setData({
      data: this.latLngs,
      max: this.max,
      min: 0,
    });
  },
  beforeDestroy() {
    this.parentContainer.removeLayer(this);
  },
};
</script>

<style>

</style>
