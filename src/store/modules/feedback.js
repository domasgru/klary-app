import { firestoreAction } from 'vuexfire';
import { db } from '@/firebase';
import { FEEDBACKS_COLLECTION, ACTIVE_STATE, ARCHIVED_STATE } from '@/constants/feedback';
import { isFeedbackSeen } from '@/utils/isFeedbackSeen';
import { bindFirestoreArrayRefMutations, bindFirestoreArrayRefAction } from '../utils/bindFirestoreRef';

export default {
  state: {
    // Sent and received has to have separate state, as firestore does not have logical OR opretator
    receivedFeedbacks: null,
    sentFeedbacks: null,
    archivedFeedbacks: null,
    currentFeedback: null,
    currentFeedbackComments: null,
  },
  getters: {
    allFeedbacks(state) {
      if (!state.receivedFeedbacks || !state.sentFeedbacks) {
        return null;
      }

      return [...state.receivedFeedbacks, ...state.sentFeedbacks];
    },
    receivedFeedbacks(state) {
      return state.receivedFeedbacks;
    },
    sentFeedbacks(state) {
      return state.sentFeedbacks;
    },
    favoritesFeedbacks(state, getters) {
      return getters.allFeedbacks;
    },
    archivedFeedbacks(state, getters) {
      return state.archivedFeedbacks;
    },
  },
  mutations: {
    ...bindFirestoreArrayRefMutations,
  },
  actions: {
    bindCurrentFeedback: firestoreAction(({ bindFirestoreRef }, feedbackId) => (
      bindFirestoreRef('currentFeedback', db.collection(FEEDBACKS_COLLECTION).doc(feedbackId))
    )),
    bindReceivedFeedbacks({ commit }, { userId, workspaceId }) {
      return bindFirestoreArrayRefAction(
        commit,
       'receivedFeedbacks',
        db.collection(FEEDBACKS_COLLECTION)
          .where('receiverId', '==', userId)
          .where(`participants.${userId}.feedbackState`, '==', ACTIVE_STATE),
      );
    },
    bindSentFeedbacks({ commit }, { userId }) {
      return bindFirestoreArrayRefAction(
        commit,
       'sentFeedbacks',
        db.collection(FEEDBACKS_COLLECTION)
          .where('authorId', '==', userId)
          .where(`participants.${userId}.feedbackState`, '==', ACTIVE_STATE),
      );
    },
    bindAllFeedbacks({ dispatch }, { userId, workspaceId }) {
      return Promise.all([
        dispatch('bindReceivedFeedbacks', { userId, workspaceId }),
        dispatch('bindSentFeedbacks', { userId, workspaceId }),
      ]);
    },
    bindCurrentFeedbackComments({ commit }, id) {
      return bindFirestoreArrayRefAction(
        commit,
        'currentFeedbackComments',
        db.collection(`${FEEDBACKS_COLLECTION}/${id}/discussion`)
        .orderBy('createdAt', 'asc'),
      );
    },
    // Separate handling for archived feedabcks
    bindArchivedFeedbacks({ commit }, { userId }) {
      return bindFirestoreArrayRefAction(
        commit,
        'archivedFeedbacks',
        db.collection(FEEDBACKS_COLLECTION)
          .where(`participants.${userId}.feedbackState`, '==', ARCHIVED_STATE),
      );
    },
  },
};
