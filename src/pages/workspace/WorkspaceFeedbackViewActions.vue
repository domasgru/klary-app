<template>
  <div class="feedback-actions">
    <WorkspaceActionButton
      class="feedback-actions__back"
      icon="arrow-left"
      @click="router.back()"
    />
    <WorkspaceActionButton
      v-if="!isFeedbackSent"
      :ref="el =>{ if(el) rightActionsRefs = [...rightActionsRefs, el] }"
      class="feedback-actions__right-action feedback-actions__right-action--1"
      icon="checkmark-black"
      :text="closeFeedbackActionButtonText"
      :active="isFeedbackClosed"
      @click="toggleFeedbackStatus"
    />
    <WorkspaceActionButton
      :ref="el =>{ if(el) rightActionsRefs = [...rightActionsRefs, el] }"
      class="feedback-actions__right-action feedback-actions__right-action--2"
      icon="star"
      theme="star"
      :active="isFeedbackFavorite"
      @click="toggleFeedbackFlag(FAVORITE_FLAG)"
    />
    <WorkspaceActionButton
      :ref="el =>{ if(el) rightActionsRefs = [...rightActionsRefs, el] }"
      class="feedback-actions__right-action feedback-actions__right-action--3"
      icon="more-horizontal"
      @click="toggleMoreOptions"
    />
  </div>
</template>

<script>
import {
 computed, ref, toRefs, onMounted, onBeforeUpdate, watch,
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
    const closeFeedbackActionButtonText = computed(() => (isFeedbackClosed.value ? 'Closed' : 'Close'));
    const archiveActionButtonText = computed(() => (isFeedbackArchived.value ? 'Unarchive for you' : 'Archive for you'));

    // ANIMATION
    const rightActionsRefs = ref([]);

    onBeforeUpdate(() => {
      rightActionsRefs.value = [];
    });
    const calcAnimationData = (parentWidth) => {
      const data = [];
      let currentIndex = 0;
      rightActionsRefs.value.forEach(({ $el }) => {
        const animationData = {};
        const x = parentWidth - $el.offsetLeft + 24;
        const y = 48 + ((40 + 8) * (currentIndex + 1));
        animationData.timeline = gsap.timeline({ paused: true }).to(
          $el,
          {
            keyframes: [
              {
                x: x + 30,
                y: -50,
                duration: 0.05,
              },
              {
                x,
                y,
                duration: 0.2,
              },
            ],
            ease: 'power1.in',
            delay: 0.05 * (rightActionsRefs.value.length - currentIndex),
          },
        );
        data.push(animationData);
        currentIndex += 1;
      });
      return data;
    };
    const runAnimations = (data) => {
      data.forEach((animation) => {
        animation.timeline.play();
      });
    };
    onMounted(() => {
      const marginTop = 48;
      const marginLeft = 24;
      const actionButtonSize = 40;
      const actionButtonSpacing = 8;
      const parentWidth = 900;
      const actionsAnimationData = calcAnimationData(parentWidth);

      runAnimations(actionsAnimationData);
    });

    watch(() => {
      console.log(props);
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
      rightActionsRefs,
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
