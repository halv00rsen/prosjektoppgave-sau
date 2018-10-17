
export default {
  namespaced: true,
  state: {
    message: undefined,
    messageOpen: false,
  },
  getters: {

  },
  actions: {
    setMessage({ commit, }, msg) {
      commit('setMessage', msg);
    },
    closeMessage({ commit, }) {
      commit('closeMessage');
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
  },
}
