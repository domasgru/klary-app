/* eslint-disable no-use-before-define */
import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Home from '@/pages/Home.vue';
import Login from '@/pages/get-started/Login.vue';
import GetStartedCreateName from '@/pages/GetStartedCreateName.vue';
import GetStartedCreateTeam from '@/pages/GetStartedCreateTeam.vue';
import GetStartedInviteTeam from '@/pages/GetStartedInviteTeam.vue';
import Workspace from '@/pages/workspace/Workspace.vue';
import WorkspaceInbox from '@/pages/workspace/WorkspaceInbox.vue';
import SelectWorkspace from '@/pages/SelectWorkspace.vue';
import PageNotFound from '@/pages/PageNotFound.vue';
import ComingSoon from '@/pages/ComingSoon.vue';

import { handleLoginAndReturnRedirect } from '@/utils/handleLogin';

import {
  auth,
  getCurrentUser,
  getWorkspace,
  getUserWorkspaces,
  getInvitedWorkspaces,
} from '@/firebase';

const WorkspaceSent = () => import('@/pages/workspace/WorkspaceSent.vue');
const WorkspaceGive = () => import('@/pages/workspace/WorkspaceGive.vue');
const WorkspaceRequest = () => import('@/pages/workspace/WorkspaceRequest.vue');
const WorkspaceFeedbackView = () => import('@/pages/workspace/WorkspaceFeedbackView.vue');

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
      path: '/create-name',
      component: GetStartedCreateName,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/create-team',
      component: GetStartedCreateTeam,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/invite-team',
      component: GetStartedInviteTeam,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/select-workspace',
      component: SelectWorkspace,
      beforeEnter: async (to, from, next) => {
        const { uid, email } = store.state.user.userData;
        const [allWorkspaces, invitedWorkspaces] = await Promise.all([
          getUserWorkspaces(uid),
          getInvitedWorkspaces(email),
        ]);
        if (!allWorkspaces.length && !invitedWorkspaces.length) {
          return next('/create-team');
        }
        store.dispatch('workspace/setAllWorkspaces', allWorkspaces);
        store.dispatch('workspace/setInvitedWorkspaces', invitedWorkspaces);
        return next();
      },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/workspace',
      component: Workspace,
      redirect: '/workspace/received',
      meta: {
        requiresAuth: true,
      },
      beforeEnter: async (to, from, next) => {
        const { currentWorkspace, uid, email } = store.state.user.userData;
        if (currentWorkspace) {
          const workspace = await getWorkspace(currentWorkspace);
          await Promise.all([
            store.dispatch('feedback/bindReceivedFeedbacks', { userId: uid, workspaceId: currentWorkspace }),
            store.dispatch('workspace/setTeam', currentWorkspace),
          ]);
          store.dispatch('workspace/setCurrentWorkspace', workspace);
          return next();
        }

        const allWorkspaces = await getUserWorkspaces(uid);
        const invitedWorkspaces = await getInvitedWorkspaces(email);
        if (allWorkspaces.length || invitedWorkspaces.length) {
          return next('/select-workspace');
        }
        return next('/create-team');
      },
      children: [
        {
          path: 'received',
          component: WorkspaceInbox,
        },
        {
          path: 'sent',
          component: WorkspaceSent,
        },
        {
          path: 'favorite',
          component: ComingSoon,
        },
        {
          path: 'highlights',
          component: ComingSoon,
        },
        {
          path: 'request-feedback',
          component: WorkspaceRequest,
        },
        {
          path: 'archived',
          component: ComingSoon,
        },
        {
          path: 'give-feedback',
          component: WorkspaceGive,
        },
        {
          path: 'received/feedback/:id',
          component: WorkspaceFeedbackView,
          beforeEnter: async (to, from, next) => {
            if (!store.state.feedback.receivedFeedbacks?.some((fb) => fb.id === to.params.id)) {
              try {
                await store.dispatch('feedback/bindCurrentFeedback', to.params.id);
              } catch (e) {
                console.error(e);
              }
            }
            next();
          },
          // eslint-disable-next-line max-len
          props: (route) => ({ feedbackData: store.state.feedback.receivedFeedbacks?.find((fb) => fb.id === route.params.id) }),
        },
        {
          path: 'sent/feedback/:id',
          component: WorkspaceFeedbackView,
          beforeEnter: async (to, from, next) => {
            if (!store.state.feedback.sentFeedbacks?.some((fb) => fb.id === to.params.id)) {
              try {
                await store.dispatch('feedback/bindCurrentFeedback', to.params.id);
              } catch (e) {
                console.error(e);
              }
            }
            next();
          },
          // eslint-disable-next-line max-len
          props: (route) => ({ feedbackData: store.state.feedback.sentFeedbacks?.find((fb) => fb.id === route.params.id) }),
        },
      ],
    },
    {
      path: '*',
      component: PageNotFound,
    },
  ],
});

// REQUIRES AUTH
router.beforeEach(async (to, from, next) => {
  store.commit('setLoading', true);
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    const user = await isLoggedIn();
    if (!user) {
      return next('/login');
    }
    if (!isUserAccountComplete(user)) {
      return next('/complete-user');
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
  if (auth.isSignInWithEmailLink(window.location.href)) {
    const email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      return next('/login');
    }

    const result = await auth.signInWithEmailLink(email, window.location.href);
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

async function beforeEnterFeedbackView(to, from, next) {
  if (!store.state.feedback.receivedFeedbacks?.some((fb) => fb.id === to.params.id)) {
    try {
      await store.dispatch('feedback/bindCurrentFeedback', to.params.id);
    } catch (e) {
      console.error(e);
    }
  }
  next();
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

async function isUserAccountComplete(userData) {
  if (!userData.name) {
    return false;
  }
  return true;
}

export default router;
