<template>
  <md-dialog
    :md-active.sync="realShow"
    :md-fullscreen="false">

    <md-dialog-title>
      Registrering
    </md-dialog-title>
    <span>
      <md-switch
        v-if="registering && !registration"
        v-model="advanced"
        class="md-primary">Detaljert</md-switch>
    </span>

    <md-dialog-content
      v-if="registering"
      md-dynamic-height>

      <div v-if="whatRegister === 'sheep'">
        <form
          novalidate
          class="md-layout"
          @submit.prevent="validateForm">

          <md-autocomplete
            v-model="form.numSheep"
            :class="getValidationClass('numSheep')"
            :md-options="numbers"
            :readonly="currentDone"
            type="number"
            required>
            <label>Totalt antall sau</label>
            <span
              v-if="!$v.form.numSheep.required"
              class="md-error">Antall sau er påkrevd</span>
            <span
              v-if="!$v.form.numSheep.minValue"
              class="md-error">Antall sau kan ikke være negativt</span>
          </md-autocomplete>

          <md-autocomplete
            v-if="advanced"
            v-model="form.numLambsTag"
            :class="getValidationClass('numLambsTag')"
            :readonly="currentDone"
            :md-options="numbers"
            type="number">
            <label for="number-lambs-tag">Antall lam på tag</label>
            <span
              v-if="!$v.form.numLambsTag.minValue"
              class="md-error">Antall lam kan ikke være negativt</span>
          </md-autocomplete>

          <md-autocomplete
            v-if="advanced"
            v-model="form.numLambs"
            :class="getValidationClass('numLambs')"
            :md-options="numbers"
            :readonly="currentDone"
            type="number"
            required>
            <label>Faktisk antall lam</label>
            <span
              v-if="!$v.form.numLambs.minValue"
              class="md-error">Antall lam kan ikke være negativt</span>
            <span
              v-if="!$v.form.numLambs.required"
              class="md-error">Antall lam er påkrevd</span>
          </md-autocomplete>

          <md-autocomplete
            v-model="form.color"
            :md-options="colors"
            :readonly="currentDone">
            <label>Farge på sauene</label>
          </md-autocomplete>

          <md-autocomplete
            v-if="advanced"
            v-model="form.colorSheepEar"
            :md-options="colors"
            :readonly="currentDone">
            <label>Farge på øremerke (hvem eier sauen)</label>
          </md-autocomplete>

          <md-field v-if="advanced">
            <label for="comment">Kommentar</label>
            <md-textarea
              v-model="form.comment"
              :readonly="currentDone"
              name="comment"
              md-autogrow/>
          </md-field>
        </form>
      </div>
      <div v-else>
        <form
          novalidate
          class="md-layout">
          <md-field>
            <label for="animal">Hvilket dyr</label>
            <md-input
              v-model="othersForm.animal"
              name="animal"/>
          </md-field>
          <md-checkbox v-model="othersForm.predator">Rovdyr</md-checkbox>
        </form>
      </div>
    </md-dialog-content>
    <md-dialog-content
      v-else
      md-dynamic-height>
      <p>Velg hvilke dyr som skal registreres:</p>
      <md-button
        class="md-primary md-raised"
        @click="whatRegister = 'sheep'">Sau</md-button>
      <md-button
        class="md-primary md-raised"
        @click="whatRegister = 'sheep'">Søye</md-button>
      <md-button
        class="md-primary md-raised"
        @click="whatRegister = 'predator'">Annet dyr</md-button>
    </md-dialog-content>

    <md-dialog-actions v-if="registering && !currentDone">
      <md-button class="md-primary md-raised right"><font-awesome-icon icon="camera"/></md-button>
      <span class="spacer"/>
      <md-button
        v-if="!registration"
        class="md-primary md-raised"
        @click="save">Lagre</md-button>
      <md-button
        v-else
        class="md-primary md-raised"
        @click="editObservation">Endre</md-button>
      <md-button
        class="md-raised"
        @click="close">Avbryt</md-button>
      <!-- <md-button class="md-raised">Flytt</md-button> -->
      <md-button
        v-if="registration"
        class="md-accent md-raised"
        @click="deleteCallback">Slett</md-button>
    </md-dialog-actions>
    <md-dialog-actions v-else>
      <md-button
        class="md-primary md-raised"
        @click="close">Lukk</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import {
  validationMixin,
} from 'vuelidate';
import {
  required,
  integer,
  minValue,
} from 'vuelidate/lib/validators';

export default {
  name: 'Registration',
  mixins: [validationMixin],
  props: {
    detailed: {
      type: Boolean,
      default: true,
    },
    show: {
      type: Boolean,
      default: true,
    },
    close: {
      type: Function,
      required: true,
    },
    saveRegistration: {
      type: Function,
      default: undefined,
    },
    deleteCallback: {
      type: Function,
      default: undefined,
    },
    editCallback: {
      type: Function,
      default: undefined,
    },
    oldObject: {
      type: Object,
      default: null,
    },
    mock: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        numSheep: null,
        numLambs: null,
        comment: null,
        color: null,
        numLambsTag: null,
        colorSheepEar: null,
      },
      numbers: [],
      othersForm: {
        animal: null,
        predator: true,
      },
      advanced: this.detailed,
      colors: [
        'Hvit',
        'Brun',
        'Svart',
        'Grå',
      ],
      whatRegister: null,
      registration: false,
    };
  },
  computed: {
    realShow: {
      get() {
        return this.show;
      },
      set(val) {
        if (!val) {
          this.close();
        }
      },
    },
    registering() {
      return this.whatRegister !== null;
    },
    currentDone() {
      if (!this.mock) {
        return this.$store.state.trip.activeTrip.done;
      }
      return false;
    },
  },
  created() {
    if (this.oldObject) {
      if (this.oldObject.numSheep !== undefined) {
        this.form.numSheep = this.oldObject.numSheep;
        this.form.numLambs = this.oldObject.numLambs;
        this.form.comment = this.oldObject.comment;
        this.form.color = this.oldObject.color;
        this.form.numLambsTag = this.oldObject.numLambsTag;
        this.form.colorSheepEar = this.oldObject.colorSheepEar;
        this.whatRegister = 'sheep';
      } else {
        this.othersForm.animal = this.oldObject.animal;
        this.othersForm.predator = this.oldObject.predator;
        this.whatRegister = 'predator';
      }
      this.registration = true;
    }
    this.numbers = this.range(1, 20);
  },
  validations() {
    const form = {
      numSheep: {
        required,
        integer,
        minValue: minValue(0),
      },
    };
    if (this.advanced) {
      form.numLambs = {
        required,
        integer,
        minValue: minValue(0),
      };
      form.numLambsTag = {
        integer,
        minValue: minValue(0),
      };
    }
    const othersForm = {
      predator: {
        required,
      },
      animal: {
        required,
      },
    };
    if (this.whatRegister === 'sheep') {
      return { form, };
    } else {
      return { othersForm, };
    }
  },
  methods: {
    save() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.whatRegister === 'sheep') {
          this.form.detailed = this.advanced;
          this.form.isSheep = true;
          this.saveRegistration(this.form);
        } else {
          this.othersForm.detailed = false;
          this.form.isSheep = false;
          this.saveRegistration(this.othersForm);
        }
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty,
        };
      }
    },
    editObservation() {
      this.editCallback(this.form);
    },
    range(start, end) {
      return Array(end - start + 1).fill().map((_, idx) => start + idx);
    },
  },
};
</script>

<style scoped>
.md-dialog {
  max-width: 90%;
  min-width: 350px;
}

.md-dialog-content > button {
  width: 100%;
  margin-left: 0em;
}

.md-dialog-title > p {
  display: inline;
}

.md-switch {
  margin: 1em;
}

.spacer {
  flex: 1 1 auto;
}

.md-dialog-actions {
  padding: 0px 24px 8px 24px;
}
</style>

<style>
.md-menu-content {
  z-index: 12 !important;
}
</style>
