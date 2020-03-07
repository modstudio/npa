import Vue from 'vue';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';
import db from './db/datastore';

import './assets/sass/app.scss';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.db = Vue.prototype.$db = db;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
