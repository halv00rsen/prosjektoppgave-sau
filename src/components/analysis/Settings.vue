
<template>
  <md-list>
    <md-list-item>
      <md-switch
        v-model="nibio"
        :disabled="showSpinner"
      />
      <span class="md-list-item-text">
        Beiteområder
      </span>
    </md-list-item>
    <md-list-item>
      <md-switch
        v-model="nina"
        :disabled="showSpinner"
      />
      <span class="md-list-item-text">
        Rovdyr
      </span>
    </md-list-item>
  </md-list>
</template>

<script>
import { mapGetters, mapState, } from 'vuex';

import ListSwitch from '@/components/analysis/ListSwitch.vue';

export default {
  name: 'Settings',
  components: {
    ListSwitch,
  },
  data: () => ({
    dataLoaded: false,
    dataLoadedNina: false,
    showSpinner: false,
    apiUrl: process.env.VUE_APP_API_ENDPOINT,
  }),
  computed: {
    ...mapState('analysis', [
      'settings',
    ]),
    ...mapGetters('analysis', {
      bounds: 'getCaseBounds',
    }),
    nibio: {
      get() {
        return this.settings.showNibio;
      },
      set(val) {
        if (!this.dataLoaded) {
          this.loadData(true);
        } else {
          this.$store.dispatch('analysis/setShowNibio', val);
        }
      },
    },
    nina: {
      get() {
        return this.settings.showPredatorData;
      },
      set(val) {
        if (!this.dataLoadedNina) {
          this.loadData(false);
        } else {
          this.$store.dispatch('analysis/setShowNina', val);
        }
      },
    },
  },
  watch: {
    showSpinner(loading) {
      this.$store.dispatch('analysis/setLoadingData', loading);
    },
  },
  mounted() {
    if (this.nina) {
      this.loadData(false);
    }
    if (this.nibio) {
      this.loadData(true);
    }
  },
  methods: {
    loadData(nibio) {
      this.showSpinner = true;
      const url = nibio ? 'attribute/data' : 'predator/';
      this.$http.get(this.apiUrl + url, {
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
        if (nibio) {
          this.$store.dispatch('analysis/setNibioData', response.data);
          this.dataLoaded = true;
        } else {
          this.$store.dispatch('analysis/setNinaData', response.data);
          this.dataLoadedNina = true;
        }
        this.showSpinner = false;
      }).catch(err => {
        console.log(err);
        this.$store.dispatch('application/setMessage', 'Kunne ikke laste data fra server');
        this.showSpinner = false;
      });
    },
  },
};
</script>
