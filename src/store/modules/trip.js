
import ApplicationDatabase from '@/database/application';
import Trip from '@/models/trip';
import { Promise, } from 'q';

const database = new ApplicationDatabase();

const state = {
  all: [],
  activeTrip: undefined,
  openTrip: undefined,
  currentPosition: undefined,
  dataLoaded: false,
  serverTrips: [],
  serverView: false,
  analysisTripList: [],
};

const getters = {
  getTrip: (state) => (tripId) => {
    tripId = tripId.toString();
    for (let trip of state.all) {
      if (trip.id === tripId) {
        return trip;
      }
    }
    return undefined;
  },
  getTripServer: (state) => (tripId) => {
    for (let trip of state.serverTrips) {
      if (trip.id === tripId) {
        return trip;
      }
    }
    return undefined;
  },
  getActiveTrip: (state) => {
    return state.activeTrip;
  },
  getOpenTrip: (state) => {
    return state.openTrip;
  },
  dataLoaded: (state) => {
    return state.dataLoaded;
  },
  serverTrips: (state) => {
    return state.serverTrips;
  },
  isServerView: (state) => () => {
    return state.serverView;
  },
};

const actions = {
  setReloadTrips({ commit, }) {
    commit('setDownloaded', false);
  },
  setServerView({ commit, }, view) {
    commit('setServerView', view);
  },
  loadTrips({ commit, }) {
    return database.getAllTrips((data) => {
      commit('setTrips', data);
      for (let trip of data) {
        if (!trip.done) {
          commit('setActiveTrip', trip);
          break;
        }
      }
      commit('setDownloaded', true);
    });
  },
  setActiveTripServer({ commit, getters, }, tripId) {
    const trip = getters.getTripServer(tripId);
    if (trip) {
      commit('setActiveTrip', trip);
    } else {
      return Promise.reject('dette er fra promise');
    }
  },
  setActiveTrip({ commit, getters, dispatch, }, tripId) {
    if (getters.isServerView()) {
      dispatch('setActiveTripServer', tripId);
      return;
    }
    const trip = getters.getTrip(tripId);
    if (trip) {
      commit('setActiveTrip', trip);
    } else {
      return Promise.reject('dette er fra promise');
    }
  },
  saveTrip({ commit, }, name) {
    const now = Date.now();
    const trip = new Trip(now.toString(), name, now);
    commit('addTrip', trip);
    commit('setActiveTrip', trip);
    database.addTrip(trip).then(() => {
    });
    return now;
  },
  deleteTrip({ commit, state, }, index) {
    database.deleteTrip(state.all[index].id);
    commit('removeTrip', index);
  },
  setActiveTripDone({ state, commit, }, name) {
    if (!state.activeTrip) {
      return;
    }
    commit('setActiveTripDone', name);
    database.addTrip(state.activeTrip);
  },
  setPosition({ commit, }, position) {
    commit('setCurrentPosition', position);
  },
  registerObservation({ state, commit, }, data) {
    if (!state.openTrip) {
      return;
    }
    data.observedPosition = {
      lng: state.currentPosition.lng,
      lat: state.currentPosition.lat,
    };
    // const observation = new Observation(data);
    commit('addObservation', data);
    // Add save to database
  },
  editObservation({ state, commit, }, { data, index, }) {
    if (!state.openTrip) {
      return;
    }
    commit('editObservation', { data, index, });
  },
  deleteObservation({ state, commit, }, index) {
    if (!state.openTrip) {
      return;
    }
    commit('deleteObservation', index);
  },
  setServerTrips({ commit, }, trips) {
    commit('setServerTrips', trips);
  },
  saveMockTrip({ commit, }, trip) {
    trip.calculateBounds();
    commit('addTrip', trip);
  },
  cleanEmptyTrips({ dispatch, state, }) {
    const emptyTrips = [];
    for (let trip of state.all) {
      if (trip.positions.length === 0 && trip.observations.length === 0) {
        emptyTrips.push(trip.id);
      }
    }
    for (let id of emptyTrips) {
      database.deleteTrip(id);
    }
    dispatch('setReloadTrips');
  },
};

const mutations = {
  setDownloaded(state, val) {
    state.dataLoaded = val;
  },
  setTrips(state, trips) {
    state.all = trips;
  },
  addObservation(state, observation) {
    state.openTrip.addObservation(observation);
  },
  addTrip(state, trip) {
    state.all.push(trip);
    state.all.sort((a, b) => {
      return a.startTime - b.startTime;
    });
  },
  removeTrip(state, index) {
    const deletedTrip = state.all.splice(index, 1)[0];
    if (state.openTrip && deletedTrip.id === state.openTrip.id) {
      state.openTrip = undefined;
    }
    if (state.activeTrip && deletedTrip.id === state.activeTrip.id) {
      state.activeTrip = undefined;
    }
  },
  setActiveTrip(state, trip) {
    state.activeTrip = trip;
    if (!trip.done) {
      state.openTrip = trip;
    }
  },
  setActiveTripDone(state, name) {
    state.openTrip.name = name;
    state.openTrip.done = true;
    state.openTrip.endTime = Date.now();
    state.openTrip = undefined;
  },
  setCurrentPosition(state, position) {
    state.currentPosition = position;
    if (state.openTrip) {
      state.openTrip.addPosition(position);
    }
  },
  editObservation(state, { data, index, }) {
    state.openTrip.editObservation(data, index);
  },
  deleteObservation(state, index) {
    state.openTrip.removeObservationAtIndex(index);
  },
  setServerTrips(state, trips) {
    state.serverTrips = trips;
  },
  setServerView(state, view) {
    state.serverView = view;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
