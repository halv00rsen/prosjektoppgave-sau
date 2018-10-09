
// import uuid from 'uuid';
import ApplicationDatabase from '@/database/application';

const database = new ApplicationDatabase();

const state = {
  all: [],
  activeTrip: undefined,
  openTrip: undefined,
}

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
  getActiveTrip: (state) => {
    return state.activeTrip;
  },
}

const actions = {
  loadTrips({ commit, }) {
    database.getAllTrips((data) => {
      commit('setTrips', data);
      for (let trip of data) {
        if (!trip.done) {
          commit('setActiveTrip', trip);
          break;
        }
      }
    });
  },
  setActiveTrip({ commit, getters, }, tripId) {
    const trip = getters.getTrip(tripId);
    if (trip) {
      commit('setActiveTrip', trip);
    }
  },
  saveTrip({ commit, }, name) {
    const now = Date.now();
    const trip = {
      id: now.toString(),
      name: name,
      startTime: now,
      done: false,
    };
    database.addTrip(trip).then((data) => {
      commit('addTrip', trip);
      commit('setActiveTrip', trip);
    });
    return now;
  },
  deleteTrip({ commit, state, }, index) {
    database.deleteTrip(state.all[index].id);
    commit('removeTrip', index);
  },
  setActiveTripDone({ state, commit, }) {
    if (!state.activeTrip) {
      return;
    }
    commit('setActiveTripDone');
    database.addTrip(state.activeTrip);
  },
}

const mutations = {
  setTrips(state, trips) {
    state.all = trips;
  },
  addTrip(state, trip) {
    state.all.push(trip);
  },
  removeTrip(state, index) {
    const deletedTrip = state.all.splice(index, 1)[0];
    if (deletedTrip.id === state.openTrip.id) {
      state.openTrip = undefined;
    }
    if (deletedTrip.id === state.activeTrip.id) {
      state.activeTrip = undefined;
    }
  },
  setActiveTrip(state, trip) {
    state.activeTrip = trip;
    if (!trip.done) {
      state.openTrip = trip;
    }
  },
  setActiveTripDone(state) {
    state.openTrip.done = true;
    state.openTrip.endTime = Date.now();
    state.openTrip = undefined;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
