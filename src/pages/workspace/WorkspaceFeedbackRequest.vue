<template>
  <div class="header">
    <h4 class="emoji h4">
      {{ feedbackRequestData.emoji }}&nbsp;
    </h4>
    <h4
      ref="feedbackRequestName"
      class="title h4"
      contenteditable="true"
      @keydown.enter.prevent
      @input="editName"
    >
      {{ feedbackRequestData.title || 'Untitled' }}
    </h4>

    <BaseButton
      class="header__button"
      type="secondary"
      @click="$router.push(`/edit-form/${feedbackRequestData.id}`)"
      v-text="'Edit form'"
    />
    <WorkspaceShareFormPopup
      class="header__button"
    />
    <BaseButton
      type="secondary"
      size="icon"
    >
      <BaseSvg
        class="header__more-icon"
        name="more-horizontal"
      />
    </BaseButton>
  </div>

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
  />
</template>

<script>
import { ref, toRefs, computed } from 'vue';
import { useFeedbackList } from '@/composables/useFeedback';
import { RECEIVED_TYPE, ACTIVE_STATUS, CLOSED_STATUS } from '@/constants/feedback';
import { updateFeedbackRequest } from '@/firebase';
import WorkspaceFeedbackList from './WorkspaceFeedbackList.vue';
import WorkspaceInboxEmptyState from './WorkspaceInboxEmptyState.vue';
import WorkspaceShareFormPopup from './WorkspaceShareFormPopup.vue';

export default {
  components: {
    WorkspaceFeedbackList,
    WorkspaceInboxEmptyState,
    WorkspaceShareFormPopup,
  },
  props: {
    feedbackRequestData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { isLoading, openFeedback, getFilteredAndSortedFeedbacks } = useFeedbackList(RECEIVED_TYPE);

    const pendingFeedbacks = getFilteredAndSortedFeedbacks({
      filter: {
        status: ACTIVE_STATUS,
        feedbackRequestId: computed(() => props.feedbackRequestData.id),
      },
    });
    const clearFeedbacks = getFilteredAndSortedFeedbacks({
      filter: {
        status: CLOSED_STATUS,
        feedbackRequestId: computed(() => props.feedbackRequestData.id),
      },
    });

    const feedbackRequestName = ref(null);
    const editName = (e) => {
      updateFeedbackRequest(props.feedbackRequestData.id, {
        title: e.target.textContent,
      });
    };

    return {
      pendingFeedbacks,
      clearFeedbacks,
      isLoading,
      openFeedback,
      RECEIVED_TYPE,
      feedbackRequestName,
      editName,
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  z-index: 1;

  &__button {
    &:not(:last-child) {
      margin-right: 8px;
    }
  }

  &__more-icon {
    width: 24px;
    height: 24px;
    padding: 2px;
    stroke: $dark;
  }
}

.title {
  margin-right: auto;
}

.feedback-list {
  &:not(:last-child) {
    margin-bottom: 32px;
  }
}
</style>
