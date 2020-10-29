import { firestoreAction } from 'vuexfire';
import { db } from '@/firebase';

export default {
  state: {
    receivedFeedbacks: null,
    sentFeedbacks: null,
    currentFeedback: null,
    currentFeedbackComments: null,
  },
  mutations: {
    setCurrentFeedback(state, value) {
      state.currentFeedback = value;
    },
  },
  actions: {
    setCurrentFeedback({ commit }, value) {
      commit('setCurrentFeedback', value);
    },
    bindCurrentFeedback: firestoreAction(({ bindFirestoreRef }, feedbackId) => (
      bindFirestoreRef('currentFeedback', db.collection('feedbacks').doc(feedbackId))
    )),
    bindReceivedFeedbacks: firestoreAction(({ bindFirestoreRef }, { userId, workspaceId }) => (
      bindFirestoreRef(
        'receivedFeedbacks',
        db.collection('feedbacks')
          .where('receiverId', '==', userId)
          .where('workspaceId', '==', workspaceId)
          .orderBy('createdAt', 'desc'),
      )
    )),
    bindSentFeedbacks: firestoreAction(({ bindFirestoreRef }, { userId, workspaceId }) => (
      bindFirestoreRef(
        'sentFeedbacks',
        db.collection('feedbacks')
          .where('authorId', '==', userId)
          .where('workspaceId', '==', workspaceId)
          .orderBy('createdAt', 'desc'),
      )
    )),
    bindCurrentFeedbackComments: firestoreAction(({ bindFirestoreRef }, id) => (
      bindFirestoreRef('currentFeedbackComments', db.collection(`feedbacks/${id}/discussion`).orderBy('createdAt', 'asc'))
    )),
  },
};
