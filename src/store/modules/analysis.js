
export default {
  namespaced: true,
  state: {
    all: [],
    dateFrom: undefined,
    dateTo: undefined,
    minLat: undefined,
    minLng: undefined,
    maxLat: undefined,
    maxLng: undefined,
    selectedTrips:[],
    filteredTrips: [],
  },
  getters: {

  },
  actions: {
    setDefaultTrips({ commit, }, trips) {
      commit('setDefaultTrips', trips);
      commit('setFilteredTrips', trips);
    },
    activateAllTrips({ commit, state, }) {
      commit('setFilteredTrips', state.filteredTrips.slice());
    },
    selectTrips({ commit, }, trips) {
      commit('selectTrips', trips);
    },
    deselectTrips({ commit, }) {
      commit('selectTrips', []);
    },
    setDates({ commit, }, start, end) {
      commit('setDates', start, end);
    },
  },
  mutations: {
    setDefaultTrips(state, trips) {
      state.all = trips.slice();
    },
    setFilteredTrips(state, trips) {
      state.filteredTrips = trips.slice();
    },
    selectTrips(state, trips) {
      state.selectedTrips = trips.slice();
    },
    setDates(state, start, end) {
      if (start && end && start > end) {
        return;
      }
      state.dateFrom = start;
      state.dateTo = end;
      state.filteredTrips = state.all.filter((elem) => {
        return (!start || elem.startTime >= start) && (!end || elem.endTime <= end);
      });
      state.selectedTrips = state.selectedTrips.filter((elem) => {
        return (!start || elem.startTime >= start) && (!end || elem.endTime <= end);
      });
    },
  },
};
