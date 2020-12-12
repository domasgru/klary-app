<template>
  <h4 class="title">
    Sent
  </h4>
  <template v-if="isLoading || activeFeedbacks.length || closedFeedbacks.length">
    <WorkspaceFeedbackList
      v-if="!isLoading"
      :feedbacks="activeFeedbacks"
      label="Active"
      empty-state-text="No active sent feedbacks"
      class="active-feedback-list"
      is-sent-feedback
      @open="openFeedback"
    />
    <WorkspaceFeedbackList
      v-if="!isLoading"
      :feedbacks="closedFeedbacks"
      label="Closed"
      empty-state-text="No closed sent feedbacks"
      class="active-feedback-list"
      is-sent-feedback
      @open="openFeedback"
    />
  </template>
  <WorkspaceInboxEmptyState
    v-else
    title="Here is a place for your given feedbacks"
    description="When someone asks you for feedback and you write it, they will all show up here."
  />
</template>

<script>
import { mapState, mapActions } from 'vuex';
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

    const activeFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: 'status',
      filterValue: ACTIVE_STATUS,
      sortReverse: true,
    });
    const closedFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: 'status',
      filterValue: CLOSED_STATUS,
      sortReverse: true,
    });

    return {
      isLoading,
      activeFeedbacks,
      closedFeedbacks,
      openFeedback,
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

.active-feedback-list {
  margin-bottom: 32px;
}

.closed-empty-state {
  width: 100%;
  padding: 29px 40px;
  color: $grey-600;
  border: 1px solid $grey-200;
  border-radius: $border-radius;
}
</style>
