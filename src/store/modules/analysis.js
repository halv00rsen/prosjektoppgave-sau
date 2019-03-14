
import colors from '@/utils/colors';
import shuffle from 'shuffle-array';

export default {
  namespaced: true,
  state: {
    all: [],
    dateFrom: undefined,
    dateTo: undefined,
    minLat: undefined,
    maxLat: undefined,
    minLng: undefined,
    maxLng: undefined,
    selectedTrips:[],
    filteredTrips: [],
    settings: {
      automaticZoom: true,
      showObservations: true,
      showObservedPoints: true,
      showDensity: false,
      showRoute: false,
    },
    selectedCase: {
      presetTrips: false,
      text: undefined,
    },
  },
  getters: {

  },
  actions: {
    setDefaultTrips({ commit, }, trips) {
      commit('setDefaultTrips', trips);
      commit('setFilteredTrips', trips);
    },
    setSelectedCase({ commit, }, _case) {
      commit('setSelectedCase', _case);
    },
    activateAllTrips({ commit, state, }) {
      commit('selectTrips', state.filteredTrips.slice());
    },
    selectTrips({ commit, }, trips) {
      commit('resetCoords');
      commit('selectTrips', trips);
    },
    deselectTrips({ commit, }) {
      commit('resetCoords');
      commit('selectTrips', []);
    },
    setDates({ commit, }, dates) {
      commit('setDates', dates);
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
    reset({ commit, }) {
      commit('resetCoords');
      commit('reset');
    },
    setShowRoute({ commit, }, showRoute) {
      commit('setShowRoute', showRoute);
    },
  },
  mutations: {
    setDefaultTrips(state, trips) {
      state.selectedTrips = [];
      state.all = trips.slice();
      let chooseColors = [];
      for (let trip of state.all) {
        if (chooseColors.length === 0) {
          chooseColors = colors.slice();
          shuffle(chooseColors);
        }
        trip.color = chooseColors.pop();
      }
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
    setDates(state, dates) {
      const start = dates.startDate;
      const end = dates.endDate;
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
      state.minLat = 71;
      state.maxLat = 60;
      state.minLng = 32;
      state.maxLng = 5;
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
    reset(state) {
      state.selectedTrips = [];
      state.settings = {
        automaticZoom: true,
        showObservations: true,
        showObservedPoints: true,
        showDensity: false,
        showRoute: false,
      };
    },
    setSelectedCase(state, _case) {
      state.selectedCase = _case;
    },
    setShowRoute(state, showRoute) {
      state.settings.showRoute = showRoute;
    },
  },
};
