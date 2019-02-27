
export default {
  namespaced: true,
  state: {
    dateFrom: undefined,
    dateTo: undefined,
    minLat: undefined,
    minLng: undefined,
    maxLat: undefined,
    maxLng: undefined,
    activeTrips: [],
  },
  getters: {

  },
  actions: {
    addTrip({ commit, }, trip) {
      commit('addTrip', trip);
    },
    removeAnalysisTrip({ commit, }, trip) {
      commit('removeTrip', trip);
    },
    setTrips({ commit, }, trips) {
      commit('setTrips', trips);
    },
    setAllTrips({ commit, state, }) {
      commit('setTrips', state.all);
    },
    removeTrips({ commit, }) {
      commit('setTrips', []);
    },
  },
  mutations: {
    setTrips(state, trips) {
      state.activeTrips = trips.slice();
    },
    addTrip(state, trip) {
      state.activeTrips.push(trip);
    },
    removeTrip(state, trip) {
      const index = state.activeTrips.indexOf(trip);
      if (index > -1) {
        state.activeTrips.splice(index, 1);
      }
    },

  },
};
