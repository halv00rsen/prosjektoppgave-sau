import Vue from 'vue';
import L from 'leaflet';
import App from './App.vue';
import router from './router';
import store from './store';
import VueMoment from 'vue-moment';

import './utils/material';
import './utils/fontawesome';

Vue.config.productionTip = false;
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
