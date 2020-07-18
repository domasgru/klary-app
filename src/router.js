/* eslint-disable no-use-before-define */
import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Home from '@/pages/Home.vue';
import Login from '@/pages/get-started/Login.vue';
import Workspace from '@/pages/Workspace.vue';
import GetStartedCreateName from '@/pages/GetStartedCreateName.vue';
import GetStartedCreateTeam from '@/pages/GetStartedCreateTeam.vue';
import GetStartedInviteTeam from '@/pages/GetStartedInviteTeam.vue';
import SelectWorkspace from '@/pages/SelectWorkspace.vue';

import {
  auth,
  getCurrentUser,
  createUserProfileDocument,
  getWorkspace,
  getUserWorkspaces,
  getInvitedWorkspaces,
} from '@/firebase';

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
      path: '/login',
      component: Login,
    },
    {
      path: '/create-name',
      component: GetStartedCreateName,
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
      meta: {
        requiresAuth: true,
      },
      beforeEnter: async (to, from, next) => {
        const { uid, email } = store.state.user.userData;
        const allWorkspaces = await getUserWorkspaces(uid);
        const invitedWorkspaces = await getInvitedWorkspaces(email);
        store.dispatch('workspace/setAllWorkspaces', allWorkspaces);
        store.dispatch('workspace/setInvitedWorkspaces', invitedWorkspaces);
        next();
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
  store.commit('setLoading', true);
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    // eslint-disable-next-line max-len
    if (store.state.user.userAuth && store.state.user.userData && store.state.workspace.currentWorkspace) {
      return next();
    }

    // Check/set userAuth
    const userAuth = store.state.user.userAuth || await getCurrentUser();
    store.dispatch('user/setUserAuth', userAuth);
    if (!userAuth) {
      return next('/login');
    }

    const userData = store.state.user.userData || await store.dispatch('user/bindUser', userAuth.uid);
    if (!userData.name) {
      return next('/create-name');
    }

    // Set current workspace
    // const currentWorkspace = await getWorkspace(userData.currentWorkspace);
    // await store.dispatch('workspace/setCurrentWorkspace', currentWorkspace);
    // return next();
  }
  return next();
});

router.afterEach(async (to, from, next) => {
  store.commit('setLoading', false);
});

async function completeAuth(to, from, next) {
  if (auth.isSignInWithEmailLink(window.location.href)) {
    const email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      return next('/login');
    }

    const result = await auth.signInWithEmailLink(email, window.location.href);
    window.localStorage.removeItem('emailForSignIn');

    const { user } = result;
    store.dispatch('user/setUserAuth', user);
    debugger;
    // Create new user profile
    if (result.additionalUserInfo.isNewUser) {
      await createUserProfileDocument(user);
      await store.dispatch('user/bindUser', user.uid);
      store.dispatch('workspace/setAllWorkspaces', []);
      return next('/create-name');
    }

    await store.dispatch('user/bindUser', user.uid);
    const userWorkspaces = await getUserWorkspaces(user.uid);
    store.dispatch('setAllWorkspaces', userWorkspaces);
    if (!store.state.user.userData.name || !userWorkspaces.length) {
      return next('/complete-user');
    }

    next('/workspace');
  }
  return next('/');
}

export default router;
