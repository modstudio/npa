import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'register',
      component: require('@/components/RegisterPage').default,
    },
    {
      path: '/lists',
      name: 'lists',
      component: require('@/components/ListsPage').default,
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: require('@/components/ContactsPage').default,
    },
    {
      path: '*',
      redirect: '/register',
    },
  ],
});
