<template>
  <l-circle-marker
    :lat-lng="position"
    :radius="5"
    :fill="true"
    :fill-opacity="1"
    :fill-color="fillColor"
    :color="color">
    <l-popup>
      Dyr: {{ data.name }}
      <br>
      Antall: {{ data.number }}
      <!-- <br>
      Datasett: {{ data.dataSet }} -->
      <br>
      Dato: {{ data.findDate }}
      <!-- {{ data.findDate | moment("YYYY.MM.DD") }} -->
      <!-- <br>
      Kjønn: {{ data.sex }} -->
      <!-- <br>
      Presisjon: {{ data.precision }} -->
    </l-popup>
  </l-circle-marker>
</template>

<script>
import {
  LCircleMarker, LPopup, LTooltip,
} from 'vue2-leaflet';
import moment from 'moment';

export default {
  name: 'Predator',
  components: {
    LCircleMarker,
    LPopup,
    LTooltip,
  },
  props: {
    data: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      position: [
        this.data.position.lat, this.data.position.lng
      ],
    };
  },
  computed: {
    fillColor() {
      const date = moment(this.data.findDate, 'DD.MM.YYYY');
      if (date.isBefore(moment().startOf('year'))) {
        return 'lightgray';
      }
      return this.color;
    },
    color() {
      switch(this.data.name) {
        case 'jerv':
          return 'black';
        case 'bjørn':
          return 'brown';
        case 'ulv':
          return 'gray';
        case 'gaupe':
          return 'yellow';
        default:
          return 'white';
      }
    },
  },
};
</script>

<style>

</style>
