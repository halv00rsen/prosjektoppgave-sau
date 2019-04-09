
import ApplicationDatabase from '@/database/application';
import Trip from '@/models/trip';

const database = new ApplicationDatabase();

export default {
  namespaced: true,
  state: {
    positions: [],
    observations: [],
    currentClick: 1,
    initialTrip: undefined,
  },
  getters: {

  },
  actions: {
    setCurrentClick({ commit, }, value) {
      commit('setCurrentClick', value);
    },
    addObservation({ commit, }, observation) {
      commit('addObservation', observation);
    },
    removeObservation({ commit, }, index) {
      commit('removeObservation', index);
    },
    removePosition({ commit, }, index) {
      commit('removePosition', index);
    },
    reset({ commit, }) {
      commit('reset');
    },
    clickMap({ commit, }, data) {
      if (data.first) {
        commit('addPositionFirst', data.pos);
      } else {
        commit('addPosition', data.pos);
      }
    },
    saveTrip({ commit, state, }, data) {
      const startTime = new Date(data.date.getTime());
      startTime.setHours(data.startHour);
      startTime.setMinutes(data.startMinute);
      const endTime = new Date(data.date.getTime());
      endTime.setHours(data.endHour);
      endTime.setMinutes(data.endMinute);
      const trip = new Trip(new Date().getTime(), data.tripName, startTime.getTime());
      trip.id = '' + new Date().getTime();
      trip.positions = state.positions;
      trip.observations = state.observations;
      trip.done = true;
      trip.endTime = endTime.getTime();
      database.addTrip(trip).then(() => {
        commit('reset');
      });
      return Promise.resolve(trip);
    },
    setInitialTrip({ commit, }, trip) {
      commit('setInitialTrip', trip);
    },
  },
  mutations: {
    addPosition(state, pos) {
      state.positions.push(pos);
    },
    reset(state) {
      state.positions = [];
      state.observations = [];
      state.currentClick = 1;
      state.initialTrip = undefined;
    },
    setCurrentClick(state, value) {
      state.currentClick = value;
    },
    removePosition(state, index) {
      state.positions.splice(index, 1);
    },
    addObservation(state, observation) {
      state.observations.push(observation);
    },
    addPositionFirst(state, pos) {
      state.positions.unshift(pos);
    },
    removeObservation(state, index) {
      state.observations.splice(index, 1);
    },
    setInitialTrip(state, trip) {
      state.initialTrip = trip;
      state.positions = trip.positions.slice();
      state.observations = trip.observations.slice();
    },
  },
};
