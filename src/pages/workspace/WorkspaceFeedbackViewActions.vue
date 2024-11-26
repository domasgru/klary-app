<template>
  <div class="feedback-actions">
    <div class="feedback-actions__left">
      <WorkspaceActionButton
        icon="arrow-left"
        class="feedback-actions__action"
        @click="goBack"
      />
    </div>
    <div class="feedback-actions__right">
      <WorkspaceActionButton
        icon="favorite"
        theme="star"
        class="feedback-actions__action"
        :active="isFeedbackFavorite"
        @click="toggleFeedbackFlag(FAVORITE_FLAG)"
      />
      <WorkspaceFeedbackSettings
        :feedback-data="feedbackData"
        position="medium-left"
        @remove="updateFeedbackStateAndClose(REMOVED_STATE)"
        @unremove="updateFeedbackStateAndClose(ACTIVE_STATE)"
        @delete="updateFeedbackStateAndClose(DELETED_STATE)"
      >
        <WorkspaceActionButton
          class="feedback-actions__right-action feedback-actions__action"
          icon="more"
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
      goBack();
    };

    const goBack = () => {
      router.push(router.currentRoute.value.path.split('/').slice(0, -1).join('/'));
    };

    return {
      router,
      isFeedbackFavorite,
      isFeedbackRemoved,
      toggleFeedbackFlag,
      updateFeedbackStateAndClose,
      goBack,
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
  top: 104px;
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
    background: $light;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>
