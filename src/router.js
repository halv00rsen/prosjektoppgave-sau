import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Map from './views/Map.vue';
import TripList from './views/TripList.vue';
import Trip from './views/Trip.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/trips',
      name: 'trips',
      component: TripList,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: Map,
    }, {
      path: '/trip/:tripId',
      name: 'trip',
      component: Trip,
    }
  ],
})
