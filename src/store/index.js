import Vue from 'vue';
import Vuex from 'vuex';
import trip from './modules/trip';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    trip,
  },
  strict: debug,
  // plugins: debug ? [createLogger()] : [],
});
