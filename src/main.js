import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueMoment from 'vue-moment';

import './utils/material';
import './utils/fontawesome';

import { L, } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import VueRouter from 'vue-router';

import axios from 'axios';
import VueAxios from 'vue-axios';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.config.productionTip = false;
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
