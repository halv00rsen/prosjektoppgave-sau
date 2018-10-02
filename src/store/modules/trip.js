
// import uuid from 'uuid';
import ApplicationDatabase from '@/database/application';

const database = new ApplicationDatabase();

const state = {
  all: [],
}

const getters = {
  getNextId: () => {
  },
}

const actions = {
  loadTrips({ commit, }) {
    database.getAllTrips((data) => {
      commit('setTrips', data);
    });
  },
  saveTrip({ commit, }, name) {
    const trip = {
      name: name,
      date: Date.now().toString(),
    };
    database.addTrip(trip).then((data) => {
      commit('addTrip', trip);
    });
  },
  deleteTrip({ commit, }, index) {
    database.deleteTrip(state.all[index].date);
    commit('removeTrip', index);
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
    state.all.splice(index, 1);
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
