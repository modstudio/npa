import Vue from 'vue';
import axios from 'axios';
import { VBTooltip } from 'bootstrap-vue/esm/directives/tooltip/tooltip';
import { BTooltip } from 'bootstrap-vue/esm/components/tooltip/tooltip';
import { CollapsePlugin } from 'bootstrap-vue';
import VueTelInput from 'vue-tel-input';
import Notifications from 'vue-notification';
import InfiniteLoading from 'vue-infinite-loading';

import { DatePicker } from 'element-ui';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

import _ from 'lodash';
import * as jQuery from 'jquery';
import moment from 'moment';
import mCustomScrollBar from 'malihu-custom-scrollbar-plugin';
import './validate';
import HelperStyle from './plugins/helper-style';

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

// For flexcal
require('jquery-ui/ui/data');
require('jquery-ui/ui/focusable');
require('jquery-ui/ui/position');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/widgets/datepicker');
require('jquery-ui/themes/base/all.css');
require('../../static/flexcal/flexcal.css');
require('../../static/flexcal/jquery.textpopup');
require('../../static/flexcal/jquery.flexcal');
require('../../static/flexcal/jquery.flexcal.format');
require('../../static/flexcal/flexcal-integrate');

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.db = Vue.prototype.$db = db;
Vue.config.productionTip = false;

Vue.directive('b-tooltip', VBTooltip);
Vue.component('b-tooltip', BTooltip);

// configure language
locale.use(lang);
Vue.use(DatePicker);

Vue.use(CollapsePlugin);
Vue.use(VueTelInput);
Vue.use(Notifications);
Vue.use(InfiniteLoading, { props: { distance: 450 } });

Vue.use(HelperStyle);

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
      require('./components/mixins/tooltip'),
      require('./components/mixins/format-date'),
      require('./components/mixins/notification'),
      require('./components/mixins/restore-db'),
      require('./components/mixins/formatter'),
    ],
    created() {
      EventBus.$on('db-restored', this.rereadStore);
    },
    destroyed() {
      EventBus.$off('db-restored', this.rereadStore);
    },
    data() {
      return {
        config,
      };
    },
  }).$mount('#app');
});
