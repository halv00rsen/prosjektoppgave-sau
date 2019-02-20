
<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-layout md-gutter">
      <div class="md-layout-item md-size-50">
        <md-datepicker
          v-model="startDate"
          :md-disabled-dates="disabledFrom"
          md-immediately>
          <label>Dato fra</label>
        </md-datepicker>
      </div>
      <div class="md-layout-item md-size-50">
        <md-datepicker
          v-model="endDate"
          :md-disabled-dates="disabledTo"
          md-immediately>
          <label>Dato til</label>
        </md-datepicker>
      </div>
    </div>

    <div class="md-layout-item md-layout md-gutter">
      <div class="md-layout-item">sek</div>
    </div>
  </div>
</template>

<script>
import SheepMap from '@/components/SheepMap.vue';

export default {
  name: 'Cases',
  components: {
    SheepMap,
  },
  data: () => ({
    startDate: undefined,
    endDate: undefined,
  }),
  methods: {
    disabledFrom(date) {
      const now = new Date();
      return date > now || (this.endDate && date > this.endDate);
    },
    disabledTo(date) {
      const now = new Date();
      return date > now || date < this.startDate;
    },
  },
};
</script>

<style>
.md-clear > .md-datepicker {
  display: none;
}

.md-datepicker-dialog {
  min-height: 286px;
  max-height: 286px;
}
</style>

