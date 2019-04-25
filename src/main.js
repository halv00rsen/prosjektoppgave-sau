import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import moment from 'moment';
import VueMoment from 'vue-moment';

import './utils/material';
import './utils/fontawesome';

import 'leaflet/dist/leaflet.css';
import VueRouter from 'vue-router';

import axios from 'axios';
import VueAxios from 'vue-axios';


Vue.config.productionTip = false;
moment.locale('nb');
Vue.use(VueMoment);

Vue.use(VueRouter);

Vue.component('router-link', Vue.options.components.RouterLink);
Vue.component('router-view', Vue.options.components.RouterView);

Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
