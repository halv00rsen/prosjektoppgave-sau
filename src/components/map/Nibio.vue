<template>
  <div>
    <l-polygon
      :lat-lngs="latlngs"
      :color="'green'">
      <l-popup>
        <div>
          Rapportår: {{ data.year }}
          <br>
          Antall sau: {{ data.sheep }}
          <br>
          Antall lam: {{ data.lambs }}
          <br>
          Tetthet (per km2): {{ data.density }}
          <br>
          Tapte lam: {{ data.lossLamb }}
          <br>
          Tapte sau: {{ data.lossSheep }}
        </div>
      </l-popup>
    </l-polygon>
  </div>
</template>

<script>
import { LPolygon, LPopup, } from 'vue2-leaflet';

export default {
  name: 'Nibio',
  components: {
    LPolygon,
    LPopup,
  },
  props: {
    data: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      latlngs: [],
    };
  },
  created() {
    for (let elem of this.data.nodes) {
      this.latlngs.push([elem.x, elem.y]);
    }
  },
};
</script>

<style>

</style>
