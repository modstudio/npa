import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/register',
      name: 'register',
      component: require('@/components/RegisterPage').default,
    },
    {
      path: '/lists',
      component: require('@/components/ListsPage').default,
      children: [
        {
          path: 'cause',
          component: require('@/components/ListsPage/CausePage').default,
        },
        {
          path: 'pledge',
          component: require('@/components/ListsPage/PledgePage').default,
        },
        {
          path: 'loan',
          component: require('@/components/ListsPage/LoanPage').default,
        },
        {
          path: 'pikadon',
          component: require('@/components/ListsPage/PikadonPage').default,
        },
        {
          path: 'dist-class',
          component: require('@/components/ListsPage/DistClassPage').default,
        },
        {
          path: 'trx-method',
          component: require('@/components/ListsPage/TrxMethodPage').default,
        },
        { path: '', redirect: 'dist-class' },
      ],
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: require('@/components/ContactsPage').default,
    },
    {
      path: '/',
      redirect: '/register',
    },
  ],
});
