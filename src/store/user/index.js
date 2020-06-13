export default {
  namespaced: true,
  state: {
    user: null,
    workspace: null,
  },
  mutations: {
    setUser(state, value) {
      state.user = value;
    },
    setWorkspace(state, value) {
      state.workspace = value;
    },
  },
  actions: {
    setUser({ commit }, value) {
      commit('setUser', value);
    },
    setWorkspace({ commit }, value) {
      commit('setWorkspace', value);
    },
  },
};
