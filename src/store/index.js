import Vue from 'vue';
import Vuex from 'vuex';
import trip from './modules/trip';
import application from './modules/application';
import analysis from './modules/analysis';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    trip,
    application,
    analysis,
  },
  strict: debug,
  // plugins: debug ? [createLogger()] : [],
});
