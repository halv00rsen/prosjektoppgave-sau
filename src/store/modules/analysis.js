
export default {
  namespaced: true,
  state: {
    all: [],
    dateFrom: undefined,
    dateTo: undefined,
    minLat: Number.MAX_SAFE_INTEGER,
    maxLat: Number.MIN_SAFE_INTEGER,
    minLng: Number.MAX_SAFE_INTEGER,
    maxLng: Number.MIN_SAFE_INTEGER,
    selectedTrips:[],
    filteredTrips: [],
    filter: {

    },
    settings: {
      automaticZoom: true,
      showObservations: true,
      showObservedPoints: true,
      showDensity: true,
    },
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
      commit('resetCoords');
      commit('selectTrips', trips);
    },
    deselectTrips({ commit, }) {
      commit('resetCoords');
      commit('selectTrips', []);
    },
    setDates({ commit, }, start, end) {
      commit('setDates', start, end);
    },
    setAutomaticZoom({ commit, }, zoom) {
      commit('setAutomaticZoom', zoom);
    },
    setShowObservations({ commit, }, observation) {
      commit('setShowObservations', observation);
    },
    setShowObservedPoints({ commit, }, showObservedPoints) {
      commit('setShowObservedPoints', showObservedPoints);
    },
    setShowDensity({ commit, }, showDensity) {
      commit('setShowDensity', showDensity);
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
      trips.forEach(elem => {
        state.minLat = Math.min(state.minLat, elem.minLat);
        state.maxLat = Math.max(state.maxLat, elem.maxLat);
        state.minLng = Math.min(state.minLng, elem.minLng);
        state.maxLng = Math.max(state.maxLng, elem.maxLng);
      });
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
    resetCoords(state) {
      state.minLat = Number.MAX_SAFE_INTEGER;
      state.maxLat = Number.MIN_SAFE_INTEGER;
      state.minLng = Number.MAX_SAFE_INTEGER;
      state.maxLng = Number.MIN_SAFE_INTEGER;
    },
    setAutomaticZoom(state, zoom) {
      state.settings.automaticZoom = zoom;
    },
    setShowObservations(state, observation) {
      state.settings.showObservations = observation;
    },
    setShowObservedPoints(state, showObservedPoints) {
      state.settings.showObservedPoints = showObservedPoints;
    },
    setShowDensity(state, showDensity) {
      state.settings.showDensity = showDensity;
    },
  },
};
