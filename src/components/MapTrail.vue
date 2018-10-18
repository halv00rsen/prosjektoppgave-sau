<template>
  <l-geo-json
    :geojson="geojson"
    :options="options"/>
</template>

<script>
import L from 'leaflet';
import {
  LGeoJson,
} from 'vue2-leaflet';

export default {
  name: 'MapTrail',
  components: {
    LGeoJson,
  },
  props: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      options: {
        pointToLayer: function (feature, latlng) {
          const fillColor = feature.properties.color;
          return L.circleMarker(latlng, {
            radius: 10,
            fillColor,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        },
      },
      geojson: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              color: '#BFBFBF',
            },
            geometry: {
              type: 'Point',
              coordinates: [this.longitude, this.latitude],
            },
          },
        ],
      },
    };
  },
};
</script>
