import Vue from 'vue';
import axios from 'axios';
import { VBTooltip } from 'bootstrap-vue/esm/directives/tooltip/tooltip';
import { BTooltip } from 'bootstrap-vue/esm/components/tooltip/tooltip';
import { CollapsePlugin } from 'bootstrap-vue';

import _ from 'lodash';
import * as jQuery from 'jquery';
import moment from 'moment';
import mCustomScrollBar from 'malihu-custom-scrollbar-plugin';
import VueTelInput from 'vue-tel-input';
import './validate';
import App from './App';
import router from './router';
import store from './store';
import db from './db/datastore';
import config from './config';
import EventBus from './shared/EventBus';

import './assets/sass/app.scss';

import './components/common/globals';

mCustomScrollBar(jQuery);

window._ = _;
window.$ = window.jQuery = jQuery;
window.moment = moment;
require('bootstrap/dist/js/bootstrap');
require('bootstrap-select/dist/js/bootstrap-select');

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.db = Vue.prototype.$db = db;
Vue.config.productionTip = false;

Vue.directive('b-tooltip', VBTooltip);
Vue.component('b-tooltip', BTooltip);
Vue.use(CollapsePlugin);
Vue.use(VueTelInput);

EventBus.$on('db-init', () => {
  // Run app after finish migration
  /* eslint-disable no-new */
  new Vue({
    components: { App },
    router,
    store,
    template: '<App/>',
    mixins: [
      require('./components/mixins/debounce'),
      require('./components/mixins/scroll-first-error'),
    ],
    data() {
      return {
        config,
      };
    },
  }).$mount('#app');
});
