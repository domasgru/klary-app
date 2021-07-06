/* eslint-disable no-use-before-define */
import { createRouter, createWebHistory } from 'vue-router';
import { store } from '@/store';
import GiveFeedback from '@/pages/give-feedback/GiveFeedback.vue';
import { NAME_TYPE_MAP } from '@/constants/feedback';
import { capitalize } from '@/utils/stringUtils';

import { getCurrentUser } from '@/firebase';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/f/:requestId/:trackingMark?',
      component: GiveFeedback,
    },
  ],
});

// REQUIRES AUTH
router.beforeEach(async (to, from, next) => {
  // store.commit('setLoading', true);
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    const user = await isLoggedIn();
    if (!user) {
      return next('/login');
    }
    return next();
  }
  return next();
});

// RESET LOADER
router.afterEach(async (to, from, next) => {
  store.commit('setLoading', false);
});

async function isLoggedIn() {
  if (store.state.user.userAuth && store.state.user.userData) {
    return store.state.user.userData;
  }

  const userAuth = store.state.user.userAuth || await getCurrentUser();
  if (!userAuth) {
    return null;
  }
  store.dispatch('user/setUserAuth', userAuth);
  const userData = store.state.user.userData || await store.dispatch('user/bindUser', userAuth.uid);
  return userData;
}
