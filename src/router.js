import Vue from 'vue';
import Router from 'vue-router';
import NotFound from './components/NotFound.vue';
import store from './store/index';
import Home from './views/trip/Home.vue';
import Map from './views/trip/Map.vue';
import TripList from './views/trip/TripList.vue';
import Trip from './views/trip/Trip.vue';
import SettingsView from './views/trip/Settings.vue';

import Cases from './views/analysis/Cases.vue';
import Overview from './views/analysis/Overview.vue';

import TripView from './views/TripView.vue';
import Analysis from './views/Analysis.vue';
import Main from './views/Main.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
    },
    {
      path: '/app',
      component: TripView,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
          beforeEnter(to, from, next) {
            if (store.getters['trip/getOpenTrip']) {
              next({name: 'trip', params: {tripId: store.getters['trip/getOpenTrip'].id,},});
            } else {
              next();
            }
          },
        },
        {
          path: 'trips',
          name: 'trips',
          component: TripList,
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsView,
        },
        {
          path: 'about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
        },
        {
          path: 'map',
          name: 'map',
          component: Map,
        },
        {
          path: 'active',
          name: 'activeTrip',
          component: Trip,
          beforeEnter(to, from, next) {
            next();
          },

        },
        {
          path: 'trip/:tripId',
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
      ],
      beforeRouteLeave (to, from, next) {
        console.log('exit hehehe');
        next();
      },

    },
    {
      path: '/analysis',
      component: Analysis,
      children: [
        {
          path: 'cases',
          name: 'cases',
          component: Cases,
        },
        {
          path: 'overview',
          name: 'overview',
          component: Overview,
        }
      ],
      beforeEnter(to, from, next) {
        store.dispatch('analysis/setDefaultTrips', store.state.trip.all);
        next();
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
      next();
    });
  } else {
    next();
  }
});

export default router;
