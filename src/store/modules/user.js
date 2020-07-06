import { firestoreAction } from 'vuexfire';
import { db, auth } from '@/firebase';

export default {
  state: {
    userAuth: null,
    userData: null,
  },
  mutations: {
    setUserAuth(state, value) {
      state.userAuth = value;
    },
    setUserData(state, value) {
      state.userData = value;
    },
  },
  actions: {
    setUserAuth({ commit }, value) {
      commit('setUserAuth', value);
    },
    setUserData({ commit }, value) {
      commit('setUserData', value);
    },
    bindUser: firestoreAction(
      ({ bindFirestoreRef }, uid) => bindFirestoreRef('userData', db.collection('users').doc(uid)),
    ),
    unbindUser: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('userData');
    }),
  },
};
