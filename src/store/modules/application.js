
import SettingsDatabase from "@/database/settings";

const database = new SettingsDatabase();

export default {
  namespaced: true,
  state: {
    message: undefined,
    messageOpen: false,
    settings: {
      positionFrequency: 60000,
    },
    positionRetrieved: false,
  },
  getters: {
    positionRetrieved: (state) => {
      return state.positionRetrieved;
    },
  },
  actions: {
    setPositionRetrieved({ commit, }, pos) {
      commit('setPositionRetrieved', pos);
    },
    setMessage({ commit, }, msg) {
      commit('setMessage', msg);
    },
    closeMessage({ commit, }) {
      commit('closeMessage');
    },
    loadSettings({ commit, }) {
      database.loadSettings().then((settings) => {
        if (settings) {
          commit('setSettings', settings);
        }
      });
    },
    setSettings({ commit, }, settings) {
      database.saveSettings(settings).then(() => {
        commit('setSettings', settings);
      });
    },
  },
  mutations: {
    setMessage(state, msg) {
      state.message = msg;
      state.messageOpen = true;
    },
    closeMessage(state) {
      state.messageOpen = false;
    },
    setSettings(state, settings) {
      state.settings = settings;
    },
    setPositionRetrieved(state, position) {
      state.positionRetrieved = position;
    },
  },
};
