import { firestoreAction } from 'vuexfire';
import { db } from '@/firebase';
import { bindFirestoreArrayRefMutations, bindFirestoreArrayRefAction } from '../utils/bindFirestoreRef';

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
    ...bindFirestoreArrayRefMutations,
  },
  actions: {
    setCurrentFeedback({ commit }, value) {
      commit('setCurrentFeedback', value);
    },
    bindCurrentFeedback: firestoreAction(({ bindFirestoreRef }, feedbackId) => (
      bindFirestoreRef('currentFeedback', db.collection('feedbacks').doc(feedbackId))
    )),
    bindReceivedFeedbacks({ commit }, { userId, workspaceId }) {
      bindFirestoreArrayRefAction(
        commit,
       'receivedFeedbacks',
        db.collection('feedbacks')
          .where('receiverId', '==', userId)
          .where('workspaceId', '==', workspaceId)
          .orderBy('createdAt', 'desc'),
      );
    },
    bindSentFeedbacks({ commit }, { userId, workspaceId }) {
      bindFirestoreArrayRefAction(
        commit,
       'sentFeedbacks',
        db.collection('feedbacks')
          .where('authorId', '==', userId)
          .where('workspaceId', '==', workspaceId)
          .orderBy('createdAt', 'desc'),
      );
    },
    bindCurrentFeedbackComments2: firestoreAction(({ bindFirestoreRef }, id) => (
      bindFirestoreRef('currentFeedbackComments', db.collection(`feedbacks/${id}/discussion`).orderBy('createdAt', 'asc'))
    )),
    bindCurrentFeedbackComments({ commit }, id) {
      return bindFirestoreArrayRefAction(
        commit,
        'currentFeedbackComments',
        db.collection(`feedbacks/${id}/discussion`)
        .orderBy('createdAt', 'asc'),
      );
    },
  },
};
