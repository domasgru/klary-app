<template>
  <h4 class="title h4">
    All sent
  </h4>
  <template v-if="isLoading || pendingFeedbacks.length || clearFeedbacks.length">
    <WorkspaceFeedbackList
      v-if="!isLoading && pendingFeedbacks.length"
      :feedbacks="pendingFeedbacks"
      :inbox-type="SENT_TYPE"
      label="Waiting to be marked as clear"
      class="feedback-list"
      is-sent-feedback
      @open="openFeedback"
    />
    <WorkspaceFeedbackList
      v-if="!isLoading && clearFeedbacks.length"
      :feedbacks="clearFeedbacks"
      :inbox-type="SENT_TYPE"
      class="feedback-list"
      is-sent-feedback
      @open="openFeedback"
    />
  </template>
  <WorkspaceInboxEmptyState
    v-else
    title="No sent feedbacks"
    illustration="sent"
  />
</template>

<script>
import { useFeedbackList } from '@/composables/useFeedback';
import { SENT_TYPE, ACTIVE_STATUS, CLOSED_STATUS } from '@/constants/feedback';
import WorkspaceFeedbackList from './WorkspaceFeedbackList.vue';
import WorkspaceInboxEmptyState from './WorkspaceInboxEmptyState.vue';

export default {
  components: {
    WorkspaceFeedbackList,
    WorkspaceInboxEmptyState,
  },
  setup() {
    const { isLoading, openFeedback, getFilteredAndSortedFeedbacks } = useFeedbackList(SENT_TYPE);

    const pendingFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: 'status',
      filterValue: ACTIVE_STATUS,
      sortReverse: true,
    });
    const clearFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: 'status',
      filterValue: CLOSED_STATUS,
      sortReverse: true,
    });

    return {
      isLoading,
      pendingFeedbacks,
      clearFeedbacks,
      openFeedback,
      SENT_TYPE,
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 32px;
}

.subtitle {
  margin-bottom: 16px;
}

.feedback-list {
  &:not(:last-child) {
    margin-bottom: 32px;
  }
}

.closed-empty-state {
  width: 100%;
  padding: 29px 40px;
  color: $grey-600;
  border: 1px solid $grey-200;
  border-radius: $border-radius;
}
</style>
