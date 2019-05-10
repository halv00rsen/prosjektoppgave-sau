
<template>
  <div>
    <div v-if="positions.length > 1">
      <l-circle-marker
        :lat-lng="startPosition"
        :radius="5"
        :color="showColor()"
        :fill-opacity="0.4"
        :fill-color="color"
        pane="shadowPane"
      >
        <l-popup>
          Startposisjon
        </l-popup>
      </l-circle-marker>
      <l-circle-marker
        :lat-lng="endPosition"
        :radius="5"
        :color="showColor()"
        :fill-color="showColor()"
        :fill-opacity="1"
        pane="shadowPane"
      >
        <l-popup>
          Sluttposisjon
        </l-popup>
      </l-circle-marker>
      <l-geo-json
        :geojson="geoJsonRoute"
        :options-style="styles"
      />
    </div>
    <div v-else-if="positions.length === 1">
      <map-trail
        :latitude="positions[0].lat"
        :longitude="positions[0].lng"
        :color="showColor()"/>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {
  LGeoJson, LCircleMarker, LPopup,
} from 'vue2-leaflet';
import MapTrail from '@/components/MapTrail.vue';
import { mapState, } from 'vuex';

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
    showGrayColor: {
      type: Boolean,
      default: false,
    },
    dateConducted: {
      type: Number,
      default: undefined,
    },
  },
  computed: {
    ...mapState('analysis', [
      'settings',
    ]),
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
    styles() {
      return {
        color: this.showColor(),
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
    showColor() {
      if (this.settings.showTime) {
        return this.showGrayColor ? 'gray' : this.color;
      }
      if (this.settings.comparison) {
        const date = moment(this.dateConducted);
        if (date.isBefore(moment().startOf('year'))) {
          return 'blue';
        } else {
          return 'green';
        }
      }
      return this.color;
    },
  },
};
</script>

<style>

</style>
