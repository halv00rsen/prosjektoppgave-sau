
<template>
  <div>
    <md-list>
      <list-switch
        dispatch="setAutomaticZoom"
        variable="automaticZoom"
        text="Automatisk zoom"/>
      <md-divider/>
      <md-list-item>
        <md-switch
          v-model="useNibio"
          @change="loadData()"
        />
        <span class="md-list-item-text">
          Vis beiteområder
        </span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
import { mapGetters, } from 'vuex';

import ListSwitch from '@/components/analysis/ListSwitch.vue';

export default {
  name: 'Settings',
  components: {
    ListSwitch,
  },
  data: () => ({
    useNibio: false,
    dataLoaded: false,
    apiUrl: process.env.VUE_APP_API_ENDPOINT,
  }),
  computed: {
    ...mapGetters('analysis', {
      bounds: 'getBounds',
    }),
  },
  methods: {
    loadData() {
      this.$store.dispatch('analysis/setShowNibio', this.useNibio);
      if (!this.dataLoaded && this.useNibio) {
        this.$http.get(this.apiUrl + 'attribute/data', {
          headers: {
            'Authorization': '',
          },
          params: {
            minX: this.bounds[0][0],
            minY: this.bounds[0][1],
            maxX: this.bounds[1][0],
            maxY: this.bounds[1][1],
          },
        }).then(response => {
          this.$store.dispatch('analysis/setNibioData', response.data);
          this.dataLoaded = true;
        });
      }
    },
  },
};
</script>
