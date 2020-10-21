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
    bindFeedbacks: firestoreAction(({ bindFirestoreRef }, { receiverId, workspaceId }) => (
      bindFirestoreRef(
        'receivedFeedbacks',
        db.collection('feedbacks')
          .where('receiverId', '==', receiverId)
          .where('workspaceId', '==', workspaceId)
          .orderBy('createdAt', 'desc'),
      )
    )),
    bindSentFeedbacks: firestoreAction(({ bindFirestoreRef }, { authorId, workspaceId }) => (
      bindFirestoreRef(
        'sentFeedbacks',
        db.collection('feedbacks')
          .where('authorId', '==', authorId)
          .where('workspaceId', '==', workspaceId)
          .orderBy('createdAt', 'desc'),
      )
    )),
    bindCurrentFeedbackComments: firestoreAction(({ bindFirestoreRef }, id) => (
      bindFirestoreRef('currentFeedbackComments', db.collection(`feedbacks/${id}/discussion`).orderBy('createdAt', 'asc'))
    )),
  },
};
