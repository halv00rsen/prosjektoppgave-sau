
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
      showObservedPoints: false,
      showDensity: false,
      showRoute: true,
      showPredators: false,
      showNumInPoint: true,
      groupTrips: true,
      lockZoom: false,
    },
    selectedCase: {
      presetTrips: false,
      fixedTrips: false,
      text: undefined,
      header: undefined,
    },
    caseSet: false,
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
    setInitialTrips({ commit, }, trips) {
      commit('setFilteredTrips', trips);
    },
    selectTrips({ commit, }, trips) {
      commit('resetCoords');
      commit('selectTrips', trips);
      commit('calculateBounds');
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
    setShowNumInPoint({ commit, }, showNumInPoint){
      commit('setShowNumInPoint', showNumInPoint);
    },
    reset({ commit, }) {
      commit('resetCoords');
      commit('reset');
    },
    setShowRoute({ commit, }, showRoute) {
      commit('resetCoords');
      commit('setShowRoute', showRoute);
      commit('calculateBounds');
    },
    setShowPredators({ commit, }, showPredators) {
      commit('setShowPredators', showPredators);
    },
    setGroupTrips({ commit, }, groupTrips) {
      commit('setGroupTrips', groupTrips);
    },
    setLockZoom({ commit, }, lockZoom) {
      commit('setLockZoom', lockZoom);
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
        showRoute: true,
        showPredators: false,
        showNumInPoint: true,
        groupTrips: true,
        lockZoom: false,
      };
    },
    setSelectedCase(state, _case) {
      state.selectedCase = _case;
      state.caseSet = true;
    },
    setShowRoute(state, showRoute) {
      state.settings.showRoute = showRoute;
    },
    calculateBounds(state) {
      state.selectedTrips.forEach(elem => {
        let bounds = elem.boundsTotal;
        if (!state.settings.showRoute || !state.settings.showObservations) {
          if (state.settings.showRoute) {
            bounds = elem.boundsPositions;
          } else {
            bounds = elem.boundsObservations;
          }
        }
        state.minLat = Math.min(state.minLat, bounds.minLat);
        state.maxLat = Math.max(state.maxLat, bounds.maxLat);
        state.minLng = Math.min(state.minLng, bounds.minLng);
        state.maxLng = Math.max(state.maxLng, bounds.maxLng);
      });
    },
    setShowPredators(state, showPredators) {
      state.settings.showPredators = showPredators;
    },
    setShowNumInPoint(state, showNumInPoint) {
      state.settings.showNumInPoint = showNumInPoint;
    },
    setGroupTrips(state, groupTrips) {
      state.settings.groupTrips = groupTrips;
    },
    setLockZoom(state, lockZoom) {
      state.settings.lockZoom = lockZoom;
    },
  },
};
