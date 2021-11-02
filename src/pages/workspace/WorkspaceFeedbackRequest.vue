<template>
  <div class="header">
    <h4
      class="header__emoji h4"
      @paste="pasteAsPlainText"
    >
      {{ feedbackRequestData.emoji }}&nbsp;
    </h4>
    <h4
      ref="feedbackRequestName"
      class="header__title h4"
      contenteditable="true"
      @keydown.enter.prevent
      @blur="editName"
      v-text="feedbackRequestData.title || 'Untitled'"
    />

    <BaseButton
      class="header__button"
      type="secondary"
      @click="$router.push(`/edit-form/${feedbackRequestData.id}`)"
      v-text="'Edit form'"
    />
    <WorkspaceShareFormPopup
      class="header__button"
    />
    <!-- <BaseButton
      class="header__button"
      type="secondary"
      size="icon"
    >
      <BaseSvg
        class="header__more-icon"
        name="more-horizontal"
      />
    </BaseButton> -->
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
    illustration="received"
  />
</template>

<script>
import { ref, toRefs, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFeedbackList } from '@/composables/useFeedback';
import { RECEIVED_TYPE, ACTIVE_STATUS, CLOSED_STATUS } from '@/constants/feedback';
import { updateFeedbackRequest } from '@/firebase';
import { pasteAsPlainText } from '@/utils/pasteAsPlainText';
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
    const { isLoading, getFilteredAndSortedFeedbacks } = useFeedbackList(RECEIVED_TYPE);
    const router = useRouter();
    const feedbackRequestId = computed(() => props.feedbackRequestData.id);

    const pendingFeedbacks = getFilteredAndSortedFeedbacks({
      filter: {
        status: ACTIVE_STATUS,
        feedbackRequestId,
      },
    });
    const clearFeedbacks = getFilteredAndSortedFeedbacks({
      filter: {
        status: CLOSED_STATUS,
        feedbackRequestId,
      },
    });

    const feedbackRequestName = ref(null);
    const editName = (e) => {
      updateFeedbackRequest(feedbackRequestId.value, {
        title: e.target.textContent,
      });
    };

    const openFeedback = (id) => router.push({ path: `/form/${feedbackRequestId.value}/${id}` });

    return {
      pendingFeedbacks,
      clearFeedbacks,
      isLoading,
      openFeedback,
      RECEIVED_TYPE,
      feedbackRequestName,
      editName,
      pasteAsPlainText,
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  z-index: 1;
  display: flex;
  align-items: start;
  margin-bottom: 32px;

  &__emoji {
    flex-shrink: 0;
  }

  &__title {
    flex-grow: 1;
    margin-right: 32px;
    outline: none;
  }

  &__button {
    flex-shrink: 0;

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

.feedback-list {
  &:not(:last-child) {
    margin-bottom: 32px;
  }
}
</style>
