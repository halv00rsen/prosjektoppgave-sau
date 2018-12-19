import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Map from './views/Map.vue';
import TripList from './views/TripList.vue';
import Trip from './views/Trip.vue';
import SettingsView from './views/Settings.vue';
import NotFound from './components/NotFound.vue';
import store from './store/index';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter(to, from, next) {
        console.log('haha digg');
        console.log(store.getters['trip/getOpenTrip']);
        console.log(store.getters['trip/getActiveTrip']);
        if (store.getters['trip/getOpenTrip']) {
          next({name: 'trip', params: {tripId: store.getters['trip/getOpenTrip'].id,},});
        } else {
          next();
        }
      },
    },
    {
      path: '/trips',
      name: 'trips',
      component: TripList,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
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
    }, 
    {
      path: '/active',
      name: 'activeTrip',
      component: Trip,
      beforeEnter(to, from, next) {
        console.log(store.getters['trip/getActiveTrip']);
        console.log(store.getters['trip/getOpenTrip']);

        next();
        // store.dispatch('trip/getActiveTrip').then((trip) => {
        //   console.log(trip);
        //   next();
        // });
      },

    },
    {
      path: '/trip/:tripId',
      name: 'trip',
      component: Trip,
      beforeEnter(to, from, next) {
        store.dispatch('trip/setActiveTrip', to.params.tripId).then(() => {
          next();
        }).catch(() => {
          next('notFound');
        });     
      },

    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound,
    }
  ],
});

router.beforeEach((to, from, next) => {
  if (!store.getters['trip/dataLoaded']) {
    store.dispatch('trip/loadTrips').then(() => {
      console.log('LOADED!');
      next();
    });
  } else {
    console.log('allesammen');
    next();
  }
});

export default router;
