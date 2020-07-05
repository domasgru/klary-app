import { db } from '@/firebase';

export default {
  state: {
    currentWorkspace: null,
    allWorkspaces: null,
  },
  mutations: {
    setCurrentWorkspace(state, value) {
      state.currentWorkspace = value;
    },
    setAllWorkspaces(state, value) {
      state.allWorkspaces = value;
    },
  },
  actions: {
    setCurrentWorkspace({ commit }, value) {
      commit('setCurrentWorkspace', value);
    },
    setAllWorkspaces({ commit }, value) {
      commit('setAllWorkspaces', value);
    },
  },
};
