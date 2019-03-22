
<template>
  <div>
    <div v-if="positions.length > 1">
      <l-circle-marker
        :lat-lng="startPosition"
        :radius="10"
        :color="color"
        :fill-opacity="0.4"
        :fill-color="color"
      >
        <l-popup>
          Startposisjon
        </l-popup>
      </l-circle-marker>
      <l-circle-marker
        :lat-lng="endPosition"
        :radius="10"
        :color="color"
        :fill-color="color"
        :fill-opacity="1"
      >
        <l-popup>
          Sluttposisjon
        </l-popup>
      </l-circle-marker>
      <l-geo-json
        :geojson="geoJsonRoute"
        :options-style="styles"/>
    </div>
    <div v-else-if="positions.length === 1">
      <map-trail
        :latitude="positions[0].lat"
        :longitude="positions[0].lng"
        :color="color"/>
    </div>
  </div>
</template>

<script>
import {
  LGeoJson, LCircleMarker, LPopup,
} from 'vue2-leaflet';
import MapTrail from '@/components/MapTrail.vue';

export default {
  name: 'TrailRoute',
  components: {
    LCircleMarker,
    LGeoJson,
    LPopup,
    MapTrail,
  },
  props: {
    positions: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      default: 'black',
    },
  },
  computed: {
    startPosition() {
      return this.positions[0];
    },
    endPosition(){
      return this.positions[this.positions.length - 1];
    },
    geoJsonRoute() {
      const list = [];
      let lastPos = undefined;
      for (let pos of this.positions) {
        if (lastPos) {
          list.push(this.getGeoJson([lastPos, pos]));
        }
        lastPos = pos;
      }
      return {
        type: 'FeatureCollection',
        features: list,
      };
    },
  },
  methods: {
    getGeoJson(posPair) {
      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [posPair[0].lng, posPair[0].lat],
            [posPair[1].lng, posPair[1].lat],
          ],
        },
      };
    },
    styles() {
      return {
        color: this.color,
      };
    },
  },
};
</script>

<style>

</style>
