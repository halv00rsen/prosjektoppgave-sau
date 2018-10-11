import Vue from 'vue';

import {
  library,
} from '@fortawesome/fontawesome-svg-core';
import {
  faTrash, faDownload, faArrowAltCircleUp,
} from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
} from '@fortawesome/vue-fontawesome';

library.add(faTrash, faDownload, faArrowAltCircleUp);
Vue.component('font-awesome-icon', FontAwesomeIcon);
