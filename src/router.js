/* eslint-disable no-use-before-define */
import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { store } from '@/store';
import Home from '@/pages/Home.vue';
import GiveFeedback from '@/pages/give-feedback/GiveFeedback.vue';
import Login from '@/pages/get-started/Login.vue';
import WorkspaceReceived from '@/pages/workspace/WorkspaceReceived.vue';
import ComingSoon from '@/pages/ComingSoon.vue';
import WorkspaceSent from '@/pages/workspace/WorkspaceSent.vue';
import WorkspaceFavorites from '@/pages/workspace/WorkspaceFavorites.vue';
import WorkspaceTrash from '@/pages/workspace/WorkspaceTrash.vue';
import WorkspaceFeedbackView from '@/pages/workspace/WorkspaceFeedbackView.vue';
import { handleLoginAndReturnRedirect } from '@/utils/handleLogin';

import { auth, getCurrentUser } from '@/firebase';

const Workspace = defineAsyncComponent(() => import('@/pages/workspace/Workspace.vue'));

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/complete-auth',
      beforeEnter: completeAuth,
    },
    {
      path: '/complete-user',
      beforeEnter: completeUser,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/give-feedback/:requestId',
      component: GiveFeedback,
    },
    {
      path: '/workspace',
      component: Workspace,
      redirect: '/workspace/received',
      meta: {
        requiresAuth: true,
      },
      beforeEnter: async (to, from, next) => {
        const { uid } = store.state.user.userData;
        await store.dispatch('feedback/bindAllFeedbacks', { userId: uid });
        return next();
      },
      children: [
        {
          path: 'received',
          component: WorkspaceReceived,
        },
        {
          path: 'sent',
          component: WorkspaceSent,
        },
        {
          path: 'favorites',
          component: WorkspaceFavorites,
        },
        {
          path: 'highlights',
          component: ComingSoon,
        },
        {
          path: 'trash',
          component: WorkspaceTrash,
        },
        {
          path: ':type/feedback/:id',
          component: WorkspaceFeedbackView,
          beforeEnter: async (to, from, next) => {
            const { type, id } = to.params;
            if (!store.getters[`feedback/${type}Feedbacks`]?.some((fb) => fb.id === id)) {
              try {
                await store.dispatch('feedback/bindCurrentFeedback', id);
              } catch (e) {
                console.error(e);
              }
            }
            next();
          },
          // eslint-disable-next-line max-len
          props: (route) => ({ feedbackData: store.getters[`feedback/${route.params.type}Feedbacks`]?.find((fb) => fb.id === route.params.id) }),
        },
      ],
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

export async function completeAuth(to, from, next) {
  if (auth.isSignInWithEmailLink(window?.location.href)) {
    const email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      return next('/login');
    }

    const result = await auth.signInWithEmailLink(email, window?.location.href);
    window.localStorage.removeItem('emailForSignIn');

    const nextRoute = await handleLoginAndReturnRedirect(result);
    next(nextRoute);
  }
  return next('/');
}

async function completeUser(to, from, next) {
  const user = await isLoggedIn();
  if (!user) {
    return next('/login');
  }
  if (!user.name) {
    return next('/create-name');
  }
  return next();
}

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
