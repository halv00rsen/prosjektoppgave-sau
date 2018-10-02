import Vue from 'vue';
import L from 'leaflet';
import App from './App.vue';
import router from './router';
import store from './store';
import VueGeolocation from 'vue-browser-geolocation';
import VueMoment from 'vue-moment'
// import moment from 'moment-timezone'

import {
  library,
} from '@fortawesome/fontawesome-svg-core';
import {
  faCoffee,
} from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
} from '@fortawesome/vue-fontawesome';
import './material';

library.add(faCoffee);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(VueGeolocation);
Vue.use(VueMoment);

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
