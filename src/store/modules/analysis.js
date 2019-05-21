
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
      showRectangle: false,
      showNibio: false,
      showHeatmap: false,
      pointSizing: false,
      showPredatorData: false,
      showTime: false,
      selectedTimeTrip: undefined,
      comparison: false,
    },
    selectedCase: {
      presetTrips: false,
      fixedTrips: false,
      text: undefined,
      header: undefined,
      bounds: undefined,
      detailedTimeline: true,
    },
    caseSet: false,
    fitBounds: undefined,
    nibioData: undefined,
    ninaData: undefined,
    loadingData: false,
    mapBounds: undefined,
  },
  getters: {
    getBounds(state) {
      if (state.minLat === undefined) {
        return undefined;
      }
      return [
        [state.minLat, state.minLng],
        [state.maxLat, state.maxLng],
      ];
    },
    getCaseBounds(state, getters) {
      if (!state.selectedCase || !state.selectedCase.bounds) {
        if (state.mapBounds) {
          return state.mapBounds;
        }
        return getters.getBounds;
      }
      return [
        [state.selectedCase.bounds.minLat, state.selectedCase.bounds.minLng],
        [state.selectedCase.bounds.maxLat, state.selectedCase.bounds.maxLng],
      ];
    },
  },
  actions: {
    setMapBounds({ commit, }, bounds) {
      commit('setMapBounds', bounds);
    },
    setLoadingData({ commit, }, loading) {
      commit('setLoadingData', loading);
    },
    setComparison({ commit, }, comparison) {
      commit('setComparison', comparison);
    },
    setTimeTrip({ commit, }, trip) {
      commit('setTimeTrip', trip);
    },
    setNinaData({ commit, }, data) {
      commit('setNinaData', data);
    },
    setShowNina({ commit, }, showPredatorData) {
      commit('setShowNina', showPredatorData);
    },
    setMainView({ commit, }, mainView) {
      commit('setMainView', mainView);
    },
    setPointSizing({ commit, }, pointSizing) {
      commit('setPointSizing', pointSizing);
    },
    setHeatmap({ commit, }, showHeatmap) {
      commit('setHeatmap', showHeatmap);
    },
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
      if (!showRoute) {
        commit('setGroupTrips', false);
      }
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
    selectTripsInBound({ commit, }, data) {
      commit('selectTripsInBound', data);
    },
    setShowRectangle({ commit, }, showRectangle) {
      commit('setShowRectangle', showRectangle);
    },
    setFitBounds({ commit, }, fitBounds) {
      commit('setFitBounds', fitBounds);
    },
    editTripVisualInfo({ commit, }, data) {
      commit('editTripVisualInfo', data);
    },
    setNibioData({ commit, }, data) {
      commit('setNibioData', data);
    },
    setShowNibio({ commit, }, showNibio) {
      commit('setShowNibio', showNibio);
    },
  },
  mutations: {
    setMapBounds(state, bounds) {
      state.mapBounds = bounds;
    },
    setLoadingData(state, loading) {
      state.loadingData = loading;
    },
    setComparison(state, comparison) {
      state.settings.comparison = comparison;
    },
    setTimeTrip(state, timeTrip) {
      state.settings.selectedTimeTrip = timeTrip;
    },
    setNinaData(state, data) {
      state.ninaData = data;
      state.settings.showPredatorData = true;
    },
    setShowNina(state, showPredatorData) {
      state.settings.showPredatorData = showPredatorData;
    },
    setMainView(state, mainView) {
      let heatmap = false;
      let sizing = false;
      let density = false;
      let time = false;
      switch(mainView) {
        case 'showHeatmap':
          heatmap = true;
          break;
        case 'pointSizing':
          sizing = true;
          break;
        case 'showDensity':
          density = true;
          break;
        case 'showTime':
          time = true;
          break;
      }
      state.settings.showHeatmap = heatmap;
      state.settings.showDensity = density;
      state.settings.pointSizing = sizing;
      state.settings.showTime = time;
    },
    setPointSizing(state, pointSizing) {
      state.settings.pointSizing = pointSizing;
    },
    setHeatmap(state, showHeatmap) {
      state.settings.showHeatmap = showHeatmap;
    },
    setShowNibio(state, showNibio) {
      state.settings.showNibio = showNibio;
    },
    setNibioData(state, data) {
      state.nibioData = data;
      state.settings.showNibio = true;
    },
    editTripVisualInfo(state, data) {
      state.all[data.index].color = data.color;
    },
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
        showRectangle: false,
        showNibio: false,
        showHeatmap: false,
        pointSizing: false,
        showPredatorData: false,
        showTime: false,
        selectedTimeTrip: undefined,
        comparison: false,
      };
      state.nibioData = undefined;
      state.ninaData = undefined;
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
    selectTripsInBound(state, data) {
      state.filteredTrips = state.filteredTrips.filter((elem) => {
        if (data.inclusive) {
          return elem.partOfTripInBound(data.bounds);
        } else {
          return elem.wholeTripInBound(data.bounds);
        }
      });
      if (state.filteredTrips) {
        state.settings.selectedTimeTrip = state.filteredTrips[0];
      }
    },
    setShowRectangle(state, showRectangle) {
      state.settings.showRectangle = showRectangle;
    },
    setFitBounds(state, fitBounds) {
      state.fitBounds = fitBounds;
    },
  },
};
