<template>
  <div>
    <form>
      <md-field>
        <label
          for="frequency">Oppdateringsfrekvens av posisjon</label>
        <md-input
          v-model="settings.positionFrequency"
          name="frequency"
          type="number"/>
      </md-field>
      <md-button
        class="md-primary md-raised"
        @click="saveSettings">Lagre instillinger</md-button>
    </form>
  </div>
</template>

<script>
import {
  validationMixin,
} from 'vuelidate';
import {
  // required,
  // integer,
  // minValue,
} from 'vuelidate/lib/validators';

export default {
  name: 'SettingsView',
  mixins: [validationMixin],
  data() {
    return {
      settings: {},
    };
  },
  created() {
    const loadedSettings = this.$store.state.application.settings;
    for (let key of Object.keys(loadedSettings)) {
      this.settings[key] = loadedSettings[key];
    }
  },
  validations() {
    // const settings = {

    // };
  },
  methods: {
    saveSettings() {
      console.log('saving');
    },
  },
};
</script>
