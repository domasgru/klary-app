<template>
  <div class="header">
    <EmojiPicker
      v-if="feedbackRequestData.emoji"
      class="header__emoji"
      :is-open="showEmojiPicker"
      hover-background-color="grey-150"
      :emoji="feedbackRequestData.emoji"
      size="md"
      @toggle="showEmojiPicker = !showEmojiPicker"
      @close="showEmojiPicker = false"
      @update-emoji="updateFormData('emoji', $event)"
    />

    <h4
      class="header__title h4"
      contenteditable="true"
      spellcheck="false"
      @keydown.enter.prevent
      @blur="updateFormData('title', $event.target.textContent)"
      @paste="pasteAsPlainText"
      v-text="feedbackRequestData.title || 'Untitled'"
    />

    <div class="header__actions">
      <BaseButton
        class="header__button"
        type="secondary"
        @click="$router.push(`/edit-form/${feedbackRequestData.id}`)"
        v-text="'Edit form'"
      />
      <WorkspaceShareFormPopup
        class="header__button"
      />
    </div>

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
import EmojiPicker from '@/pages/EmojiPicker.vue';
import WorkspaceFeedbackList from './WorkspaceFeedbackList.vue';
import WorkspaceInboxEmptyState from './WorkspaceInboxEmptyState.vue';
import WorkspaceShareFormPopup from './WorkspaceShareFormPopup.vue';

export default {
  components: {
    WorkspaceFeedbackList,
    WorkspaceInboxEmptyState,
    WorkspaceShareFormPopup,
    EmojiPicker,
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
    const showEmojiPicker = ref(false);

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

    const updateFormData = (key, value) => {
      updateFeedbackRequest(feedbackRequestId.value, {
        [key]: value,
      });
    };

    const openFeedback = (id) => router.push({ path: `/form/${feedbackRequestId.value}/${id}` });

    return {
      pendingFeedbacks,
      clearFeedbacks,
      isLoading,
      openFeedback,
      RECEIVED_TYPE,
      updateFormData,
      pasteAsPlainText,
      showEmojiPicker,
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  z-index: 1;
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;

  &__emoji-container {
    padding: 8px;
  }

  &__emoji {
    flex-shrink: 0;
  }

  &__title {
    flex-basis: 0;
    flex-grow: 1;
    padding: 8px;
    margin-right: 32px;
    border-radius: 10px;
    outline: none;

    &:focus-within {
      background: $grey-150;
    }

    &:hover {
      background: $grey-150;
    }
  }

  &__actions {
    display: flex;
    padding-top: 8px;
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
