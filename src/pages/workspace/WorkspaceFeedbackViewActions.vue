<template>
  <div
    ref="actionsRef"
    class="feedback-actions"
  >
    <div
      ref="backRef"
      class="feedback-actions__back animation-wrapper"
    >
      <WorkspaceActionButton
        icon="arrow-left"
        @click="router.back()"
      />
    </div>
    <div
      v-if="!isFeedbackSent"
      ref="closeRef"
      class="feedback-actions__right-action animation-wrapper"
    >
      <WorkspaceActionButton
        icon="checkmark-black"
        :text="showOnSides? '' : closeFeedbackActionButtonText"
        :active="isFeedbackClosed"
        @click="toggleFeedbackStatus"
      />
    </div>
    <div
      ref="starRef"
      class="feedback-actions__right-action animation-wrapper"
    >
      <WorkspaceActionButton
        icon="star"
        theme="star"
        :active="isFeedbackFavorite"
        @click="toggleFeedbackFlag(FAVORITE_FLAG)"
      />
    </div>
    <WorkspaceFeedbackSettings
      ref="moreRef"
      :feedback-data="feedbackData"
      :position="settingsPopupPosition"
      @archive="updateFeedbackStateAndClose(ARCHIVED_STATE)"
      @unarchive="updateFeedbackStateAndClose(ACTIVE_STATE)"
      @delete="updateFeedbackStateAndClose(DELETED_STATE)"
    >
      <WorkspaceActionButton
        class="feedback-actions__right-action"
        icon="more-horizontal"
        @click="toggleMoreOptions"
      />
    </WorkspaceFeedbackSettings>
  </div>
</template>

<script>
import {
 computed, ref, toRefs, onMounted, onBeforeUpdate, watch, nextTick,
} from 'vue';
import { useRouter } from 'vue-router';
import { useFeedbackData } from '@/composables/useFeedback';
import {
 ACTIVE_STATUS, CLOSED_STATUS, FAVORITE_FLAG, ACTIVE_STATE, ARCHIVED_STATE, DELETED_STATE,
} from '@/constants/feedback';
import { gsap } from 'gsap';
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
    showOnSides: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const {
      isFeedbackClosed,
      isFeedbackFavorite,
      isFeedbackArchived,
      isFeedbackSent,
      toggleFeedbackFlag,
      updateFeedbackStatus,
      updateFeedbackState,
    } = useFeedbackData(toRefs(props).feedbackData);

    const toggleFeedbackStatus = () => {
      if (isFeedbackClosed.value) {
        updateFeedbackStatus(ACTIVE_STATUS);
      } else {
        updateFeedbackStatus(CLOSED_STATUS);
      }
    };
    const updateFeedbackStateAndClose = (state) => {
      updateFeedbackState(state);
      router.back();
    };
    const toggleMoreOptions = () => {};
    const closeFeedbackActionButtonText = computed(() => {
      if (isFeedbackClosed.value) {
        return 'Closed';
      }
        return 'Close';
    });
    const archiveActionButtonText = computed(() => (isFeedbackArchived.value ? 'Unarchive for you' : 'Archive for you'));
    const settingsPopupPosition = computed(() => (props.showOnSides ? 'medium-left' : 'bottom-left'));
    // ANIMATION
    const actionsRef = ref(null);
    const backRef = ref(null);
    const closeRef = ref(null);
    const starRef = ref(null);
    const moreRef = ref(null);

    let actionsAnimationData = null;

    const calcAnimationData = (parentWidth) => {
      const leftActionsRefs = [backRef.value].filter((v) => v);
      const rightActionsRefs = [closeRef.value, starRef.value, moreRef.value].filter((v) => v);
      const actionsWrapperWidth = actionsRef.value.offsetWidth;

      const data = [];
      const animationOptions = (x, y, index) => ({
        keyframes: [
          {
            y: -30,
            duration: 0.15,
            opacity: 0.1,
          },
          {
            x,
            duration: 0.1,
            opacity: 0.1,
            delay: 0.05 * ((rightActionsRefs.length - 1) - index),
          },
          {
            x,
            y,
            opacity: 1,
            duration: 0.15,

          },
        ],
        ease: 'sine.inOut',
        // delay: 0.05 * (rightActionsRefs.length - index),
      });

      let leftCurrentIndex = 0;
      leftActionsRefs.forEach((actionRef) => {
        const element = actionRef.$el || actionRef;
        const animationData = {};
        const x = 0 - element.offsetLeft - element.offsetWidth - 24;
        const y = ((40 + 8) * (leftCurrentIndex + 1));
        animationData.timeline = gsap.timeline({ paused: true }).to(
          element,
          animationOptions(x, y, leftCurrentIndex),
        );
        data.push(animationData);
        leftCurrentIndex += 1;
      });

      let rightCurrentIndex = 0;
      rightActionsRefs.forEach((actionRef) => {
        const element = actionRef.$el || actionRef;
        const animationData = {};
        const x = actionsWrapperWidth - element.offsetLeft + 24;
        const y = ((40 + 8) * (rightCurrentIndex + 1));
        animationData.timeline = gsap.timeline({ paused: true }).to(
          element,
          animationOptions(x, y, rightCurrentIndex),
        );
        data.push(animationData);
        rightCurrentIndex += 1;
      });
      return data;
    };
    const controlAnimations = (control) => {
      actionsAnimationData.forEach((animation) => {
        animation.timeline[control](0);
      });
    };
    watch(() => props.showOnSides, async (value) => {
      await nextTick();
      if (value) {
        if (!actionsAnimationData) {
          actionsAnimationData = calcAnimationData();
        }
        controlAnimations('play');
      } else {
        controlAnimations('reverse');
      }
    });

    return {
      router,
      isFeedbackClosed,
      isFeedbackFavorite,
      isFeedbackArchived,
      isFeedbackSent,
      toggleFeedbackStatus,
      toggleFeedbackFlag,
      updateFeedbackStateAndClose,
      toggleMoreOptions,
      closeFeedbackActionButtonText,
      settingsPopupPosition,
      archiveActionButtonText,
      FAVORITE_FLAG,
      ARCHIVED_STATE,
      ACTIVE_STATE,
      DELETED_STATE,
      actionsRef,
      backRef,
      closeRef,
      starRef,
      moreRef,
    };
  },
};
</script>

<style lang="scss" scoped>
.feedback-actions {
  position: sticky;
  top: 57px;
  left: 0;
  z-index: 1;
  display: flex;
  margin-bottom: 16px;

  &__back {
    margin-right: auto;
  }

  &__right-action {
    &:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
