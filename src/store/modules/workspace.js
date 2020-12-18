export default {
  state: {
    currentWorkspace: null,
    allWorkspaces: [],
    invitedWorkspaces: [],
  },
  mutations: {
    setCurrentWorkspace(state, value) {
      state.currentWorkspace = value;
    },
    setAllWorkspaces(state, value) {
      state.allWorkspaces = value;
    },
    setInvitedWorkspaces(state, value) {
      state.invitedWorkspaces = value;
    },
  },
  actions: {
    setCurrentWorkspace({ commit }, value) {
      commit('setCurrentWorkspace', value);
    },
    setAllWorkspaces({ commit }, value) {
      commit('setAllWorkspaces', value);
    },
    setInvitedWorkspaces({ commit }, value) {
      commit('setInvitedWorkspaces', value);
    },
  },
};
