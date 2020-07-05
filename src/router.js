import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Home from '@/pages/Home.vue';
import Login from '@/pages/get-started/Login.vue';
import Workspace from '@/pages/Workspace.vue';
import CompleteUser from '@/pages/complete-user/CompleteUser.vue';
import CompleteAuth from '@/pages/CompleteAuth.vue';
import { getCurrentUser, getUserDocument, getWorkspace } from '@/firebase';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/complete-auth',
      component: CompleteAuth,
    },
    {
      path: '/login',
      component: Login,
      // beforeEnter: async (to, from, next) => {
      //   const user = await getCurrentUser();
      //   console.log(user);
      //   if (user) {
      //     next('/');
      //     return;
      //   }
      //   next();
      // },
    },
    {
      path: '/complete-user',
      component: CompleteUser,
      meta: {
        requiresUncompletedUser: true,
      },
    },
    {
      path: '/workspace',
      component: Workspace,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    // eslint-disable-next-line max-len
    if (store.state.user.userAuth && store.state.workspace.currentWorkspace && store.state.user.userData) {
      next();
      return;
    }

    store.commit('setLoading', true);

    // Check if user logged in
    const userAuth = store.state.user.userAuth || await getCurrentUser();
    store.dispatch('user/setUserAuth', userAuth);
    if (!userAuth) {
      next('/login');
      store.commit('setLoading', false);
      return;
    }

    // Check if user is completed
    const userData = store.state.userData || await store.dispatch('user/bindUser', userAuth.uid);
    if (!userData.name || !userData.currentWorkspace) {
      next('/complete-user');
      store.commit('setLoading', false);
      return;
    }

    // Set current workspace
    const currentWorkspace = await getWorkspace(userData.currentWorkspace);
    await store.dispatch('workspace/setCurrentWorkspace', currentWorkspace);
    next();
    store.commit('setLoading', false);
    return;
  }

  if (to.matched.some((route) => route.meta.requiresUncompletedUser)) {
    if (!from.path === '/complete-auth') {
      next('/login');
    }

    next();
  }

  // if (to.matched.some((route) => route.path === '/workspace')) {
  //   console.log('route');
  // }
  next();
});


export default router;
