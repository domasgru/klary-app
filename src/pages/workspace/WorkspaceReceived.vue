<template>
  <h4 class="title h4">
    Received
  </h4>
  <template v-if="isLoading || pendingFeedbacks.length || clearFeedbacks.length">
    <WorkspaceFeedbackList
      v-if="!isLoading && pendingFeedbacks.length"
      :feedbacks="pendingFeedbacks"
      :inbox-type="RECEIVED_TYPE"
      label="Waiting to be marked as clear"
      class="feedback-list"
      @open="openFeedback"
    />
    <WorkspaceFeedbackList
      v-if="!isLoading && clearFeedbacks.length"
      :feedbacks="clearFeedbacks"
      :inbox-type="RECEIVED_TYPE"
      @open="openFeedback"
    />
  </template>
  <WorkspaceInboxEmptyState
    v-else
    title="No received feedbacks"
    illustration="received-il"
  >
    <WorkspaceRequestFeedbackUI>
      <BaseButton
        v-text="'Request first feedback'"
      />
    </WorkspaceRequestFeedbackUI>
  </WorkspaceInboxEmptyState>
</template>

<script>
import { useFeedbackList } from '@/composables/useFeedback';
import { RECEIVED_TYPE, ACTIVE_STATUS, CLOSED_STATUS } from '@/constants/feedback';
import WorkspaceFeedbackList from './WorkspaceFeedbackList.vue';
import WorkspaceInboxEmptyState from './WorkspaceInboxEmptyState.vue';
import WorkspaceRequestFeedbackUI from './WorkspaceRequestFeedbackUI.vue';

export default {
  components: {
    WorkspaceFeedbackList,
    WorkspaceInboxEmptyState,
    WorkspaceRequestFeedbackUI,
  },
  setup() {
    const { isLoading, openFeedback, getFilteredAndSortedFeedbacks } = useFeedbackList(RECEIVED_TYPE);

    const pendingFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: 'status',
      filterValue: ACTIVE_STATUS,
    });
    const clearFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: 'status',
      filterValue: CLOSED_STATUS,
    });

    return {
      pendingFeedbacks,
      clearFeedbacks,
      isLoading,
      openFeedback,
      RECEIVED_TYPE,
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 32px;
}

.feedback-list {
  &:not(:last-child) {
    margin-bottom: 32px;
  }
}
</style>
