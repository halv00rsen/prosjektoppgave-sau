
<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-layout md-gutter md-small-size-50 md-xsmall-size-100">
      <div class="md-layout-item md-size-35">
        <md-datepicker
          v-model="startDate"
          :md-disabled-dates="disabledFrom"
          md-immediately>
          <label>Dato fra</label>
        </md-datepicker>
      </div>
      <div class="md-layout-item md-size-35">
        <md-datepicker
          v-model="endDate"
          :md-disabled-dates="disabledTo"
          md-immediately>
          <label>Dato til</label>
        </md-datepicker>
      </div>
      <div class="md-layout-item md-size-20">
        <md-button
          class="md-raised"
          @click="setDates()">Filtrer</md-button>
        <md-button
          class="md-raised"
          @click="clearDates()">Fjern datoer</md-button>
      </div>
      <div class="md-layout-item md-size-100">
        <SheepMap
          :use-download="false"
          :analysis-view="true"/>
      </div>
    </div>
    <!-- <div class="md-layout-item md-layout md-gutter md-small-size-50 md-xsmall-size-100"> -->
    <div class="md-layout-item md-small-size-50 md-xsmall-size-100">
      <Statistics/>
    </div>
  </div>
</template>

<script>
import SheepMap from '@/components/SheepMap.vue';
import Statistics from '@/components/analysis/Statistics.vue';

export default {
  name: 'Overview',
  components: {
    SheepMap,
    Statistics,
  },
  data: () => ({
    startDate: undefined,
    endDate: undefined,
  }),
  computed: {
    validDates() {
      return (!this.startDate || !this.endDate) || this.startDate <= this.endDate;
    },
  },
  methods: {
    disabledFrom(date) {
      const now = new Date();
      return date > now || (this.endDate && date > this.endDate);
    },
    disabledTo(date) {
      const now = new Date();
      return date > now || date < this.startDate;
    },
    setDates() {
      this.$store.dispatch('analysis/setDates', this.startDate, this.endDate);
    },
    clearDates() {
      this.startDate = undefined;
      this.endDate = undefined;
      this.setDates();
    },
  },
};
</script>

<style>
.md-datepicker-dialog {
  min-height: 286px;
  max-height: 286px;
}
</style>
