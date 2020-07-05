import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
  },
  mutations: {
    setLoading(state, value) {
      state.loading = value;
    },
    ...vuexfireMutations,
  },
  modules,
});
