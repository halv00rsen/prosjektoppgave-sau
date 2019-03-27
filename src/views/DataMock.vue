<template>
  <div>
    <h3>Lag ny tur manuelt</h3>
    <div v-if="!setMapData">
      <form
        novalidate
        @submit.prevent="validateForm">
        <md-field
          :class="getValidationClass('tripName')">
          <label>Navn på turen</label>
          <span
            v-if="!$v.form.tripName.required"
            class="md-error">Navn på turen er påkrevd</span>
          <md-input
            v-model="form.tripName"
            required
          />
        </md-field>
        <md-datepicker
          v-model="form.date"
          :class="getValidationClass('date')"
          md-immediately
          required>
          <label>Dato gjennomført</label>
          <span
            v-if="!$v.form.date.required"
            class="md-error">Dato turen skjedde er påkrevd</span>
        </md-datepicker>
        <label>Starttidspunkt</label>
        <div class="md-layout">
          <br>
          <md-field
            :class="getValidationClass('startHour')"
            class="md-layout-item">
            <label>Time</label>
            <span
              v-if="!$v.form.startHour.required"
              class="md-error">Starttime er påkrevd</span>
            <md-select
              v-model="form.startHour"
              required>
              <md-option
                v-for="elem of hours()"
                :key="'start-' + elem"
                :value="elem"
              >
                {{ elem }}
              </md-option>
            </md-select>
          </md-field>
          <md-field
            :class="getValidationClass('startMinute')"
            class="md-layout-item">
            <label>Minutt</label>
            <span
              v-if="!$v.form.startMinute.required"
              class="md-error">Startminutt er påkrevd</span>
            <md-select
              v-model="form.startMinute"
              required>
              <md-option
                v-for="elem of minutes()"
                :key="'start-' + elem"
                :value="elem"
              >
                {{ elem }}
              </md-option>
            </md-select>
          </md-field>
        </div>
        <label>Sluttidspunkt</label>
        <div class="md-layout">
          <md-field
            :class="getValidationClass('endHour')"
            class="md-layout-item">
            <label>Time</label>
            <span
              v-if="!$v.form.endHour.required"
              class="md-error">Sluttime er påkrevd</span>
            <md-select
              v-model="form.endHour"
              required>
              <md-option
                v-for="elem of hours()"
                :key="'start-' + elem"
                :value="elem"
              >
                {{ elem }}
              </md-option>
            </md-select>
          </md-field>
          <md-field
            :class="getValidationClass('endMinute')"
            class="md-layout-item">
            <label>Minutt</label>
            <span
              v-if="!$v.form.endMinute.required"
              class="md-error">Sluttminutt er påkrevd</span>
            <md-select
              v-model="form.endMinute"
              required>
              <md-option
                v-for="elem of minutes()"
                :key="'start-' + elem"
                :value="elem"
              >
                {{ elem }}
              </md-option>
            </md-select>
          </md-field>
        </div>
      </form>
      <md-button
        :md-ripple="false"
        class="md-raised"
        @click="setMapDataFunc()"
      >
        Sett kartdata
      </md-button>
    </div>
    <div v-else>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-70">
          <mock-map/>
          <md-button
            :md-ripple="false"
            class="md-raised"
            @click="saveTrip()">
            Lagre tur
          </md-button>
          <md-button
            :md-ripple="false"
            class="md-raised"
            @click="back()">
            Tilbake
          </md-button>
          <md-button
            :md-ripple="false"
            class="md-raised"
            @click="resetData()">
            Fjern data
          </md-button>
        </div>
        <div class="md-layout-item md-size-30">
          <md-tabs style="height: 70vh;">
            <md-tab
              id="data"
              md-label="Data"
              class="side-view-content-2"
            >
              <md-list>
                <md-list-item>
                  <md-radio
                    v-model="currentClick"
                    :value="1"
                  />
                  <span class="md-list-item-text">Turrute</span>
                </md-list-item>
                <md-list-item>
                  <md-radio
                    v-model="currentClick"
                    :value="2"
                  />
                  <span class="md-list-item-text">Detaljert observasjon</span>
                </md-list-item>
                <md-list-item>
                  <md-radio
                    v-model="currentClick"
                    :value="3"
                  />
                  <span class="md-list-item-text">Observasjon</span>
                </md-list-item>
                <md-list-item>
                  <md-radio
                    v-model="currentClick"
                    :value="4"
                  />
                  <span class="md-list-item-text">Ingen</span>
                </md-list-item>
              </md-list>
            </md-tab>
            <md-tab
              id="locations"
              md-label="Turrute"
              class="side-view-content-2"
            >
              <md-list>
                <md-list-item
                  v-for="(pos, index) of positions"
                  :key="'list-pos-' + index"
                  @click="removePos(index)">
                  <md-icon>clear</md-icon>
                  <span class="md-list-item-text">{{ pos }}</span>
                </md-list-item>
              </md-list>
            </md-tab>
            <md-tab
              id="observations"
              md-label="Observasjoner"
              class="side-view-content-2"
            >
              <md-list>
                <md-list-item
                  v-for="(obs, index) of observations"
                  :key="'list-obs-' + index"
                  @click="removeObservation(index)">
                  <md-icon>clear</md-icon>
                  <span
                    v-if="obs.isSheep"
                    class="md-list-item-text">Sauer: {{ obs.numSheep }}</span>
                  <span
                    v-else
                    class="md-list-item-text">
                    {{ obs.animal }}
                  </span>
                </md-list-item>
              </md-list>
            </md-tab>
          </md-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  validationMixin,
} from 'vuelidate';
import {
  required,
} from 'vuelidate/lib/validators';

import MockMap from '@/components/mock/MockMap.vue';

export default {
  name: 'DataMock',
  components: {
    MockMap,
  },
  mixins: [validationMixin],
  data: () => {
    return {
      form: {
        tripName: 'Turen',
        date: new Date(),
        startHour: 10,
        endHour: 20,
        startMinute: 0,
        endMinute: 0,
      },
      setMapData: false,
    };
  },
  computed: {
    currentClick: {
      get() {
        return this.$store.state.mock.currentClick;
      },
      set(value) {
        this.$store.dispatch('mock/setCurrentClick', value);
      },
    },
    positions() {
      return this.$store.state.mock.positions;
    },
    observations() {
      return this.$store.state.mock.observations;
    },
    trip() {
      return this.$store.state.mock.initialTrip;
    },
  },
  created() {
    if (this.trip !== undefined) {
      this.form.tripName = this.trip.name;
      const startTime = new Date(this.trip.startTime);
      this.form.date = startTime;
      this.form.startHour = startTime.getHours();
      this.form.startMinute = startTime.getMinutes();
      const endTime = new Date(this.trip.endTime);
      this.form.endHour = endTime.getHours();
      this.form.endMinute = endTime.getMinutes();
    }
  },
  beforeDestroy() {
    this.resetData();
  },
  validations() {
    const form = {
      tripName: {
        required,
      },
      date: {
        required,
      },
      startHour: {
        required,
      },
      startMinute: {
        required,
      },
      endHour: {
        required,
      },
      endMinute: {
        required,
      },
    };
    return { form, };
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty,
        };
      }
    },
    hours() {
      const list = [];
      for (let i = 0; i < 24; i++) {
        list.push(i);
      }
      return list;
    },
    minutes() {
      const list = [];
      for (let i = 0; i < 60; i += 5) {
        list.push(i);
      }
      return list;
    },
    removePos(index) {
      this.$store.dispatch('mock/removePosition', index);
    },
    removeObservation(index) {
      this.$store.dispatch('mock/removeObservation', index);
    },
    setMapDataFunc() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.setMapData = true;
      }
    },
    saveTrip() {
      this.$store.dispatch('mock/saveTrip', this.form).then((trip) => {
        this.$store.dispatch('trip/saveMockTrip', trip);
        this.$router.push({ name: 'main', });
      });
    },
    back() {
      this.setMapData = false;
    },
    resetData() {
      this.$store.dispatch('mock/reset');
    },
  },
};
</script>


<style>
.md-tabs {
  overflow-x: hidden;
}
.side-view-content-2 {
  height: 65vh;
  overflow-y: auto;
}
</style>
