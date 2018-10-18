<template>
  <md-dialog
    :md-active.sync="realShow">

    <md-dialog-title v-if="currentDone">
      Registrering
    </md-dialog-title>
    <md-dialog-title v-else-if="whatRegister === 'sheep'">
      Ny registrering av sau
    </md-dialog-title>
    <md-dialog-title v-else-if="whatRegister === 'predator'">
      Ny registrering av annet dyr
    </md-dialog-title>
    <md-dialog-title v-else>
      Hva skal registreres?
    </md-dialog-title>

    <div v-if="whatRegister !== null">
      <md-dialog-content>
        <md-switch
          v-if="!registration"
          v-model="advanced"
          class="md-primary">Avansert</md-switch>
        <div v-if="whatRegister === 'sheep'">
          <form
            novalidate
            class="md-layout"
            @submit.prevent="validateForm">

            <md-field :class="getValidationClass('numAdultSheep')">
              <label
                v-if="advanced"
                for="number-sheep">Antall voksen sau</label>
              <label
                v-else
                for="number-sheep">Totalt antall sau</label>
              <md-input
                v-model="form.numAdultSheep"
                :readonly="currentDone"
                name="number-sheep"
                type="number"/>
              <span
                v-if="!$v.form.numAdultSheep.required"
                class="md-error">Antall sau er påkrevd</span>
              <span
                v-if="!$v.form.numAdultSheep.minValue"
                class="md-error">Antall sau kan ikke være negativt</span>
            </md-field>

            <md-field
              v-if="advanced"
              :class="getValidationClass('numLambsTag')">
              <label for="number-lambs-tag">Antall lam på tag</label>
              <md-input
                v-model="form.numLambsTag"
                :readonly="currentDone"
                name="number-lambs-tag"
                type="number"/>
              <span
                v-if="!$v.form.numLambsTag.minValue"
                class="md-error">Antall lam kan ikke være negativt</span>
            </md-field>

            <md-field
              v-if="advanced"
              :class="getValidationClass('numLambs')">
              <label for="number-lambs">Antall lam</label>
              <md-input
                v-model="form.numLambs"
                :readonly="currentDone"
                name="number-lambs"
                type="number"/>
              <span
                v-if="!$v.form.numLambs.minValue"
                class="md-error">Antall lam kan ikke være negativt</span>
              <span
                v-if="!$v.form.numLambs.required"
                class="md-error">Antall lam er påkrevd</span>
            </md-field>

            <md-autocomplete
              v-model="form.color"
              :md-options="colors"
              :readonly="currentDone">
              <label>Farge på sauene</label>
            </md-autocomplete>

            <md-field v-if="advanced">
              <label for="color-sheep-ear">Farge på øremerke (hvem eier sauen)</label>
              <md-input
                v-model="form.colorSheepEar"
                :readonly="currentDone"
                name="color-sheep-ear"/>
            </md-field>

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
          <md-dialog-content>
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
          </md-dialog-content>
        </div>
      </md-dialog-content>
      <md-dialog-actions v-if="!currentDone">
        <md-button class="md-primary md-raised right"><font-awesome-icon icon="camera"/></md-button>
        <span class="spacer"/>
        <md-button
          class="md-primary md-raised"
          @click="save">Lagre</md-button>
        <md-button
          class="md-raised"
          @click="close">Avbryt</md-button>
        <md-button class="md-raised">Flytt</md-button>
        <md-button
          v-if="registration"
          class="md-accent md-raised">Slett</md-button>
      </md-dialog-actions>
      <md-dialog-actions v-else>
        <md-button
          class="md-primary md-raised"
          @click="close">Ok</md-button>
      </md-dialog-actions>
    </div>
    <div v-else>
      <md-dialog-actions>
        <md-button
          class="md-primary md-raised"
          @click="whatRegister = 'sheep'">Sau</md-button>
        <span class="spacer"/>
        <md-button
          class="md-primary md-raised"
          @click="whatRegister = 'predator'">Annet dyr</md-button>
      </md-dialog-actions>
    </div>
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
    oldObject: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        numAdultSheep: null,
        numLambs: null,
        comment: null,
        color: null,
        numLambsTag: null,
        colorSheepEar: null,
      },
      othersForm: {
        animal: null,
        predator: false,
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
    currentDone() {
      return this.$store.state.trip.activeTrip.done;
    },
  },
  created() {
    if (this.oldObject) {
      this.form = this.oldObject;
      this.whatRegister = 'sheep';
      this.advanced = true;
      this.registration = true;
    }
  },
  validations() {
    const form = {
      numAdultSheep: {
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
    return { form, };
  },
  methods: {
    save() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.saveRegistration(this.form);
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
  },
};
</script>

<style scoped>
.md-field {
  margin: 1em;
}

.md-switch {
  margin: 1em;
}

.spacer {
  flex: 1 1 auto;
}
</style>
