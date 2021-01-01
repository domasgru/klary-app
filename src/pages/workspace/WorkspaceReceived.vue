<template>
  <h4 class="title h4">
    Received
  </h4>
  <template v-if="isLoading || activeFeedbacks.length || closedFeedbacks.length">
    <WorkspaceFeedbackList
      v-if="!isLoading"
      :feedbacks="activeFeedbacks"
      label="Active"
      empty-state-text="All your given feedbacks are closed."
      class="feedback-list"
      @open="openFeedback"
    />
    <WorkspaceFeedbackList
      v-if="!isLoading"
      :feedbacks="closedFeedbacks"
      label="Closed "
      empty-state-text="Once you close the feedback you received, it will be moved here."
      @open="openFeedback"
    />
  </template>
  <WorkspaceInboxEmptyState
    v-else
    title="Get your first feedback"
    description="It can be about anything, quarterly or yearly review or just ask others how you align with company values."
  >
    <WorkspaceRequestFeedbackUI>
      <BaseButton
        v-text="'Request first feedback'"
      />
    </WorkspaceRequestFeedbackUI>
  </WorkspaceInboxEmptyState>
</template>

<script>
import { computed } from 'vue';
import { mapState, mapActions } from 'vuex';
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

    const activeFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: 'status',
      filterValue: ACTIVE_STATUS,
    });
    const closedFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: 'status',
      filterValue: CLOSED_STATUS,
    });

    return {
      activeFeedbacks,
      closedFeedbacks,
      isLoading,
      openFeedback,
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 32px;
}

.feedback-list {
  margin-bottom: 32px;
}
</style>
