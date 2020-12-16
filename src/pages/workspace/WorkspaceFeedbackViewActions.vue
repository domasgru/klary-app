<template>
  <div
    ref="actionsRef"
    class="feedback-actions"
  >
    <WorkspaceActionButton
      ref="backRef"
      class="feedback-actions__back"
      icon="arrow-left"
      @click="router.back()"
    />
    <WorkspaceActionButton
      v-if="!isFeedbackSent"
      ref="closeRef"
      class="feedback-actions__right-action feedback-actions__right-action--1"
      icon="checkmark-black"
      :text="showOnSides? '' : closeFeedbackActionButtonText"
      :active="isFeedbackClosed"
      @click="toggleFeedbackStatus"
    />
    <WorkspaceActionButton
      ref="starRef"
      class="feedback-actions__right-action feedback-actions__right-action--2"
      icon="star"
      theme="star"
      :active="isFeedbackFavorite"
      @click="toggleFeedbackFlag(FAVORITE_FLAG)"
    />
    <WorkspaceActionButton
      ref="moreRef"
      class="feedback-actions__right-action feedback-actions__right-action--3"
      icon="more-horizontal"
      @click="toggleMoreOptions"
    />
  </div>
</template>

<script>
import {
 computed, ref, toRefs, onMounted, onBeforeUpdate, watch, nextTick,
} from 'vue';
import { useRouter } from 'vue-router';
import { useFeedbackData } from '@/composables/useFeedback';
import {
 ACTIVE_STATUS, CLOSED_STATUS, FAVORITE_FLAG, ACTIVE_STATE, ARCHIVED_STATE,
} from '@/constants/feedback';
import { gsap } from 'gsap';
import WorkspaceActionButton from './WorkspaceActionButton.vue';

export default {
  components: {
    WorkspaceActionButton,
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
    const toggleFeedbackState = async () => {
      if (isFeedbackArchived.value) {
        updateFeedbackState(ACTIVE_STATE);
        router.back();
      } else {
        updateFeedbackState(ARCHIVED_STATE);
        router.back();
      }
    };
    const toggleMoreOptions = () => {};
    const closeFeedbackActionButtonText = computed(() => {
      if (isFeedbackClosed.value) {
        return 'Closed';
      }
        return 'Close';
    });
    const archiveActionButtonText = computed(() => (isFeedbackArchived.value ? 'Unarchive for you' : 'Archive for you'));

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
                y: -50,
                duration: 0.05,
              },
              {
                x,
                duration: 0.05,
                opacity: 0,
                delay: 0.05,
              },
              {
                x,
                y,
                opacity: 1,
                duration: 0.05,
                delay: 0.05,
              },
            ],
            ease: 'sine',
            delay: 0.05 * (rightActionsRefs.length - index),
      });

      let leftCurrentIndex = 0;
      leftActionsRefs.forEach(({ $el }) => {
        const animationData = {};
        const x = 0 - $el.offsetLeft - $el.offsetWidth - 24;
        const y = 48 + ((40 + 8) * (leftCurrentIndex + 1));
        animationData.timeline = gsap.timeline({ paused: true }).to(
          $el,
          animationOptions(x, y, leftCurrentIndex),
        );
        data.push(animationData);
        leftCurrentIndex += 1;
      });

      let rightCurrentIndex = 0;
      rightActionsRefs.forEach(({ $el }) => {
        const animationData = {};
        const x = actionsWrapperWidth - $el.offsetLeft + 24;
        const y = 48 + ((40 + 8) * (rightCurrentIndex + 1));
        animationData.timeline = gsap.timeline({ paused: true }).to(
          $el,
          animationOptions(x, y, rightCurrentIndex),
        );
        data.push(animationData);
        rightCurrentIndex += 1;
      });
      return data;
    };
    const controlAnimations = (control) => {
      actionsAnimationData.forEach((animation) => {
        animation.timeline[control]();
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
      toggleFeedbackState,
      toggleMoreOptions,
      closeFeedbackActionButtonText,
      archiveActionButtonText,
      FAVORITE_FLAG,
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
