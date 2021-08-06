/* eslint-disable no-use-before-define */
import { createRouter, createWebHistory } from 'vue-router';
import { store } from '@/store';
import GiveFeedback from '@/pages/give-feedback/GiveFeedback.vue';
import Login from '@/pages/get-started/Login.vue';
import WorkspaceReceived from '@/pages/workspace/WorkspaceReceived.vue';
import ComingSoon from '@/pages/ComingSoon.vue';
import Workspace from '@/pages/workspace/Workspace.vue';
import WorkspaceSent from '@/pages/workspace/WorkspaceSent.vue';
import WorkspaceFavorites from '@/pages/workspace/WorkspaceFavorites.vue';
import WorkspaceTrash from '@/pages/workspace/WorkspaceTrash.vue';
import WorkspaceFeedbackView from '@/pages/workspace/WorkspaceFeedbackView.vue';
import WorkspaceHighlights from '@/pages/workspace/WorkspaceHighlights.vue';
import WorkspaceFeedbackRequest from '@/pages/workspace/WorkspaceFeedbackRequest.vue';
import WorkspaceEditFeedbackRequest from '@/pages/workspace/WorkspaceEditFeedbackRequest.vue';
import WorkspacePreviewFeedbackRequest from '@/pages/workspace/WorkspacePreviewFeedbackRequest.vue';
import { NAME_TYPE_MAP } from '@/constants/feedback';
import { capitalize } from '@/utils/stringUtils';

import { getCurrentUser } from '@/firebase';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/f/:requestId',
      component: GiveFeedback,
    },
    {
      path: '/edit-form/:id',
      component: WorkspaceEditFeedbackRequest,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/preview-form/:id',
      component: WorkspacePreviewFeedbackRequest,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/',
      component: Workspace,
      redirect: '/received',
      meta: {
        requiresAuth: true,
      },
      beforeEnter: async (to, from, next) => {
        const { uid } = store.state.user.userData;
        const { feedbackRequests, sentFeedbacks, receivedFeedbacks } = store.state.feedback;
        if (feedbackRequests && sentFeedbacks && receivedFeedbacks) {
          return next();
        }

        await Promise.all([
          store.dispatch('feedback/bindAllFeedbacks', { userId: uid }),
          store.dispatch('feedback/bindFeedbackRequests', { userId: uid }),
          store.dispatch('user/bindCustomUI', uid),
        ]);

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
          component: WorkspaceHighlights,
        },
        {
          path: 'trash',
          component: WorkspaceTrash,
        },
        {
          path: 'form/:id',
          component: WorkspaceFeedbackRequest,
          beforeEnter: async (to, form, next) => {
            const { id } = to.params;
            if (!store.state.feedback?.feedbackRequests.some((fr) => fr.id === id)) {
              next('/not-found');
            }
            next();
          },
          props: (route) => ({ feedbackRequestData: store.state.feedback.feedbackRequests.find((fr) => fr.id === route.params.id) }),
        },
        {
          path: 'form/:formId/:id',
          component: WorkspaceFeedbackView,
          beforeEnter: async (to, from, next) => {
            const { formId, id } = to.params;
            if (!store.getters['feedback/receivedFeedbacks']?.some((fb) => fb.id === id)) {
              try {
                await store.dispatch(
                  'feedback/bindReceivedFeedbacks',
                  { userId: store.state.user.userData.uid },
                );
              } catch (e) {
                console.error(e);
              }
            }
            next();
          },
          // eslint-disable-next-line max-len
          props: (route) => ({ feedbackData: store.getters['feedback/receivedFeedbacks']?.find((fb) => fb.id === route.params.id) }),
        },
        {
          path: ':type/:id',
          component: WorkspaceFeedbackView,
          beforeEnter: async (to, from, next) => {
            const { type, id } = to.params;
            if (!store.getters[`feedback/${NAME_TYPE_MAP[type]}Feedbacks`]?.some((fb) => fb.id === id)) {
              try {
                await store.dispatch(
                  `feedback/bind${capitalize(NAME_TYPE_MAP[type])}Feedbacks`,
                  { userId: store.state.user.userData.uid },
                );
              } catch (e) {
                console.error(e);
              }
            }
            next();
          },
          // eslint-disable-next-line max-len
          props: (route) => ({ feedbackData: store.getters[`feedback/${NAME_TYPE_MAP[route.params.type]}Feedbacks`]?.find((fb) => fb.id === route.params.id) }),
        },
      ],
    },
    {
      path: '/test',
      component: Workspace,
      redirect: '/test/received',
      beforeEnter: (to, from, next) => {
        store.dispatch('user/setUserAuth', {
          uid: 'asdasdas',
          email: 'test@gmail.lt',
        });
        store.dispatch('user/setUserData', {
          name: 'Test User',
          email: 'test@gmail.lt',
          uid: 'asdasdasd',
        });
        next();
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
