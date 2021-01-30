<template>
  <div class="feedback-actions">
    <div class="feedback-actions__left">
      <WorkspaceActionButton
        icon="arrow-left"
        class="feedback-actions__action"
        @click="router.back()"
      />
    </div>
    <div class="feedback-actions__right">
      <WorkspaceActionButton
        icon="star"
        theme="star"
        class="feedback-actions__action"
        :active="isFeedbackFavorite"
        @click="toggleFeedbackFlag(FAVORITE_FLAG)"
      />
      <WorkspaceFeedbackSettings
        :feedback-data="feedbackData"
        position="medium-left"
        class="feedback_actions__action"
        @remove="updateFeedbackStateAndClose(REMOVED_STATE)"
        @unremove="updateFeedbackStateAndClose(ACTIVE_STATE)"
        @delete="updateFeedbackStateAndClose(DELETED_STATE)"
      >
        <WorkspaceActionButton
          class="feedback-actions__right-action"
          icon="more-horizontal"
        />
      </WorkspaceFeedbackSettings>
    </div>
  </div>
</template>

<script>
import { toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useFeedbackData } from '@/composables/useFeedback';
import {
 FAVORITE_FLAG, ACTIVE_STATE, REMOVED_STATE, DELETED_STATE,
} from '@/constants/feedback';
import WorkspaceActionButton from './WorkspaceActionButton.vue';
import WorkspaceFeedbackSettings from './WorkspaceFeedbackSettings.vue';

export default {
  components: {
    WorkspaceActionButton,
    WorkspaceFeedbackSettings,
  },
  props: {
    feedbackData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const {
      isFeedbackFavorite,
      isFeedbackRemoved,
      toggleFeedbackFlag,
      updateFeedbackState,
    } = useFeedbackData(toRefs(props).feedbackData);

    const updateFeedbackStateAndClose = (state) => {
      updateFeedbackState(state);
      router.push(`/${router.currentRoute.value.params.type}`);
    };

    return {
      router,
      isFeedbackFavorite,
      isFeedbackRemoved,
      toggleFeedbackFlag,
      updateFeedbackStateAndClose,
      FAVORITE_FLAG,
      REMOVED_STATE,
      ACTIVE_STATE,
      DELETED_STATE,
    };
  },
};
</script>

<style lang="scss" scoped>
.feedback-actions {
  position: sticky;
  top: 112px;
  left: 0;
  z-index: 1;
  display: flex;

  &__left {
    position: absolute;
    top: 0;
    left: -56px;
  }

  &__right {
    position: absolute;
    top: 0;
    right: -56px;
  }

  &__action {
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>
