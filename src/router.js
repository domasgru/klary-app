import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/pages/Home.vue';
import GetStarted from '@/pages/get-started/GetStarted.vue';
import GetStartedCreate from '@/pages/get-started/GetStartedCreate.vue';
import GetStartedJoin from '@/pages/get-started/GetStartedJoin.vue';
import CreateWorkspace from '@/pages/CreateWorkspace.vue';
import JoinWorkspace from '@/pages/JoinWorkspace.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/get-started',
      component: GetStarted,
    },
    {
      path: '/get-started/create',
      component: GetStartedCreate,
    },
    {
      path: '/get-started/join',
      component: GetStartedJoin,
    },
    {
      path: '/create-workspace',
      component: CreateWorkspace,
    },
    {
      path: '/join-workspace',
      component: JoinWorkspace,
    },
  ],
});
