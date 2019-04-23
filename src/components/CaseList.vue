<template>
  <div class="viewport md-layout-item">
    <md-toolbar :md-elevation="1">
      <div class="md-toolbar-row">
        <div class="md-toobar-section-start">
          <span class="md-title">
            <md-icon class="md-primary">{{ icon }}</md-icon>
            {{ title }}
          </span>
        </div>
        <div class="md-toolbar-section-end">
          <md-button
            v-if="tooltip"
            class="md-icon-button">
            <md-icon>help_outline</md-icon>
            <md-tooltip
              md-direction="bottom"
              md-delay="300"
            >
              {{ tooltip }}
            </md-tooltip>
          </md-button>
        </div>
      </div>
    </md-toolbar>

    <md-list>
      <md-list-item
        v-for="(item, index) of cases"
        :key="title + '.case.' + index"
        @click="_clickItem(item)">
        <md-icon v-if="useIcons && item.icon">
          {{ item.icon }}
        </md-icon>
        <md-icon v-else-if="useIcons">
          navigation
        </md-icon>
        <span class="md-list-item-text">
          {{ item.text }}
        </span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
export default {
  name: 'CaseList',
  props: {
    title: {
      required: true,
      type: String,
    },
    icon: {
      required: true,
      type: String,
    },
    cases: {
      required: true,
      type: Array,
    },
    useIcons: {
      default: false,
      type: Boolean,
    },
    tooltip: {
      default: undefined,
      type: String,
    },
  },
  methods: {
    _clickItem(_case) {
      this.$emit('clickedCase', _case);
    },
  },
};
</script>

<style scoped>
.md-list-item {
  border: black solid 1px;
  margin: 1em;
}
.viewport {
  margin-top: 1em;
}
</style>
