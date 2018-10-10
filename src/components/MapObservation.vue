<template>
  <l-geo-json
    :geojson="geojson"
    :options="options">
  </l-geo-json>
</template>

<script>
import L from 'leaflet';
import {
  LGeoJson,
} from 'vue2-leaflet';

export default {
  name: 'MapObservation',
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
    observerLatitude: {
      type: Number,
      required: true,
    },
    observerLongitude: {
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
              color: '#00ff00',
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [this.longitude, this.latitude],
                [this.observerLongitude, this.observerLatitude],
              ],
            },
          },
          {
            type: 'Feature',
            properties: {
              color: '#ffcc00',
            },
            geometry: {
              type: 'Point',
              coordinates: [this.longitude, this.latitude],
            },
          },
          {
            type: 'Feature',
            properties: {
              color: '#ff0000',
            },
            geometry: {
              type: 'Point',
              coordinates: [this.observerLongitude, this.observerLatitude],
            },
          },
        ],
      },
    }
  },
}
</script>

<style>

</style>
