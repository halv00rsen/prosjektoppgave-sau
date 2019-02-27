
<template>
  <div>
    Brukerhistorier
    <md-list>
      <Case
        v-for="(item, index) of cases"
        :key="index"
        :text="item.text"/>
    </md-list>
  </div>
</template>

<script>
import Case from '@/components/analysis/Case.vue';

export default {
  name: 'Cases',
  components: {
    Case,
  },
  data: () => ({
    cases: [
      {
        text: 'Se alle turer gjort noensinne',
        filters: [

        ],
      },
      {
        text: 'Se alle turer det siste året',
        filters: [

        ],
      },
    ],
  }),
};
</script>

<style>

</style>

