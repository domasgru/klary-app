import { firestoreAction } from 'vuexfire';
import { db } from '@/firebase';

export default {
  state: {
    userAuth: null,
    userData: null,
    customUI: null,
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
    bindCustomUI: firestoreAction(
      ({ bindFirestoreRef }, uid) => bindFirestoreRef('customUI', db.collection('customUI').doc(uid)),
    ),
    unbindUser: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('userData');
    }),
  },
};
