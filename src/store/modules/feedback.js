import { firestoreAction } from 'vuexfire';
import { db } from '@/firebase';

export default {
  state: {
    feedbacks: null,
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
    bindFeedbacks: firestoreAction(({ bindFirestoreRef }, { receiverId, workspaceId }) => (
      bindFirestoreRef(
        'feedbacks',
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
