import { firestoreAction } from 'vuexfire';
import { db } from '@/firebase';

export default {
  state: {
    feedbacks: null,
    currentFeedback: null,
    currentFeedbackComments: null,
  },
  mutations: {
    setFeedbacks(state, value) {
      state.feedbacks = value;
    },
    setCurrentFeedback(state, value) {
      state.currentFeedback = value;
    },
  },
  actions: {
    setFeedbacks({ commit }, value) {
      commit('setFeedbacks', value);
    },
    setCurrentFeedback({ commit }, value) {
      commit('setCurrentFeedback', value);
    },
    bindFeedbacks: firestoreAction(({ bindFirestoreRef }, { receiverId, workspaceId }) => (
      bindFirestoreRef('feedbacks', db.collection('feedbacks').where('receiverId', '==', receiverId).where('workspaceId', '==', workspaceId))
    )),
    bindCurrentFeedbackComments: firestoreAction(({ bindFirestoreRef }, id) => (
      bindFirestoreRef('currentFeedbackComments', db.collection(`feedbacks/${id}/discussion`).orderBy('createdAt', 'asc'))
    )),
  },
};
