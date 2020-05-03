export default {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    setUser(state, value) {
      state.user = value;
    },
  },
  actions: {
    setUser({ commit }, value) {
      commit('setUser', value);
    },
  },
};
