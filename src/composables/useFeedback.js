/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import {
  computed, ref,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import arraySort from 'array-sort';
import getObjectValue from 'get-value';
import {
  RECEIVED_TYPE, SENT_TYPE, FAVORITE_FLAG, FAVORITES_TYPE, REMOVED_STATE, REMOVED_TYPE, ACTIVE_STATUS, CLOSED_STATUS,
} from '@/constants/feedback';
import { isFeedbackSeen } from '@/utils/isFeedbackSeen';
import { updateFeedback, addAction } from '@/firebase';

const validTypes = [RECEIVED_TYPE, SENT_TYPE, FAVORITES_TYPE, REMOVED_TYPE];

export const useFeedbackList = (type) => {
  const store = useStore();
  const router = useRouter();
  const isLoading = ref(false);

  const isValidType = validTypes.includes(type);
  const currentUser = store.state.user.userData;

  const feedbacks = isValidType
    ? computed(() => store.getters[`feedback/${type}Feedbacks`])
    : computed(() => store.getters.allFeedbacks);

  const getFeedbackList = async () => {
    isLoading.value = true;
    await store.dispatch(
      'feedback/bindAllFeedbacks',
      { userId: store.state.user.userData.uid },
    );

    if (type === REMOVED_TYPE) {
      await store.dispatch('feedback/bindRemovedFeedbacks', { userId: store.state.user.userData.uid });
    }
    isLoading.value = false;
  };

  if (!feedbacks.value) {
    getFeedbackList();
  }

  const compare = (prop, reverse = true) => {
    if (prop === 'isSeen') {
      return (a, b) => {
        const result = isFeedbackSeen(b, currentUser.uid) - isFeedbackSeen(a, currentUser.uid);
        return reverse ? result * -1 : result;
      };
    }

    return (a, b) => {
      a = getObjectValue(a, prop);
      b = getObjectValue(b, prop);
      let result;
      if (a < b) {
        result = -1;
      }
      if (a > b) {
        result = 1;
      }
      if (a === b) {
        return 0;
      }
      return reverse ? result * -1 : result;
    };
  };

  const getFilteredAndSortedFeedbacks = ({
    filter, filterBy, filterValue, sortBy = 'createdAt.seconds', sortReverse = false,
  }) => computed(() => {
    try {
      let preparedFeedbacks = null;
      if (filter) {
        preparedFeedbacks = feedbacks.value.filter((feedback) => Object.entries(filter).every(([filterBy, filterValue]) => {
          const valueToFilter = getObjectValue(feedback, filterBy);

          if (typeof filterValue === 'object') {
            return filterValue.value === valueToFilter;
          }
          return filterValue === valueToFilter;
        }));
      }

      if (filterBy && filterValue) {
        preparedFeedbacks = feedbacks.value.filter((feedback) => {
          const valueToFilter = getObjectValue(feedback, filterBy);
          if (Array.isArray(valueToFilter)) {
            return valueToFilter.includes(filterValue);
          }

          return valueToFilter === filterValue;
        });
      }
      if (sortBy) {
        preparedFeedbacks = arraySort(preparedFeedbacks, compare('isSeen'), compare(sortBy));
      }

      return preparedFeedbacks;
    } catch (e) {
      console.error('Feedbacks didnt load yet', e);
      return [];
    }
  });
  const openFeedback = (id) => router.push({ path: `/${type === REMOVED_TYPE ? 'trash' : type.toLowerCase()}/${id}` });

  return {
    feedbacks, isLoading, getFilteredAndSortedFeedbacks, openFeedback,
  };
};

export const useFeedbackData = (feedbackData, inboxType) => {
  const store = useStore();
  const userData = computed(() => store.state.user.userData);
  const feedbackFlags = computed(() => feedbackData.value.participants[userData.value.uid]?.flags);
  const feedbackId = computed(() => feedbackData.value.id);
  const isSelfFeedback = computed(() => feedbackData.value.authorId === feedbackData.value.receiverId);
  const isFeedbackSent = computed(() => {
    const isAuthor = feedbackData.value.authorId === userData.value.uid;

    if (isSelfFeedback.value && inboxType === RECEIVED_TYPE) {
      return false;
    }
    if (isSelfFeedback.value && (inboxType === SENT_TYPE || inboxType === FAVORITES_TYPE)) {
      return true;
    }

    return isAuthor;
  });
  const feedbackCardUserId = computed(() => {
    // Ability to rewrite data in feedback card UI, with example
    if (feedbackData.value.exampleAuthorId) {
      return feedbackData.value.exampleAuthorId;
    }

    return isFeedbackSent.value
      ? feedbackData.value.receiverId
      : feedbackData.value.authorId;
  });

  const toggleFeedbackFlag = (flag) => {
    const updatedFlags = feedbackFlags.value.includes(flag)
      ? feedbackFlags.value.filter((feedbackFlag) => feedbackFlag !== flag)
      : [...feedbackFlags.value, flag];

    return updateFeedback({
      feedbackId: feedbackId.value,
      path: `participants.${userData.value.uid}.flags`,
      value: updatedFlags,
    });
  };
  const updateFeedbackStatus = (status) => updateFeedback({
    feedbackId: feedbackId.value,
    path: 'status',
    value: status,
  });
  const updateFeedbackState = (state) => updateFeedback({
    feedbackId: feedbackId.value,
    path: `participants.${userData.value.uid}.feedbackState`,
    value: state,
  });
  const addFeedbackAction = (type, content) => addAction({
    feedbackId: feedbackId.value,
    type,
    content,
    authorUid: userData.value.uid,
  });

  const getParticipant = (uid) => feedbackData.value.participants[uid];

  return {
    feedbackFlags,
    feedbackCardUser: computed(() => feedbackData.value.participants[feedbackCardUserId.value]),
    feedbackAuthor: computed(() => feedbackData.value.participants[feedbackData.value.authorId]),
    isFeedbackClosed: computed(() => feedbackData.value?.status === CLOSED_STATUS),
    isFeedbackFavorite: computed(() => feedbackFlags.value.includes(FAVORITE_FLAG)),
    isFeedbackRemoved: computed(() => feedbackData.value.participants[userData.value.uid]?.feedbackState === REMOVED_STATE),
    isFeedbackSent,
    isFeedbackLastActionSeen: computed(() => isFeedbackSeen(feedbackData.value, userData.value.uid)),
    isSelfFeedback,
    isExampleFeedback: computed(() => !!feedbackData.value.exampleAuthorId),
    toggleFeedbackFlag,
    updateFeedbackStatus,
    updateFeedbackState,
    addFeedbackAction,
    getParticipant,
  };
};
