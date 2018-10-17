import Vue from 'vue';

import {
  library,
} from '@fortawesome/fontawesome-svg-core';
import {
  faTrash, faDownload, faArrowAltCircleUp, faCamera,
} from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
} from '@fortawesome/vue-fontawesome';

library.add(faTrash, faDownload, faArrowAltCircleUp, faCamera);
Vue.component('font-awesome-icon', FontAwesomeIcon);
