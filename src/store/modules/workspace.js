import Vue from 'vue';
import { db, getUserDocument } from '@/firebase';
import { diff } from 'fast-array-diff';

export default {
  state: {
    currentWorkspace: null,
    allWorkspaces: [],
    invitedWorkspaces: [],
    teamIds: [],
    team: {},
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
    setTeamIds(state, value) {
      state.teamIds = value;
    },
    setTeamMember(state, { id, value }) {
      // state.team[id] = value;
      Vue.set(state.team, [id], value);
    },
    deleteTeamMember(state, id) {
      Vue.delete(state.team, id);
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
    async setTeam({ commit, state }, workspaceId) {
      const unsubscribe = await db.doc(`workspaces/${workspaceId}`).onSnapshot(async (doc) => {
        const newTeamIds = doc.data().team;
        const { added, removed } = diff(state.teamIds, newTeamIds);
        if (added.length) {
          const users = await Promise.all(added.map(async (userId) => getUserDocument(userId)));
          users.forEach((user) => { commit('setTeamMember', { id: user.uid, value: user }); });
        }
        if (removed.length) {
          removed.forEach((user) => { commit('delete', user); });
        }

        commit('setTeamIds', newTeamIds);
        return unsubscribe;
      });
    },
  },
};
