<template>
  <div class="feedback-view">
    <WorkspaceFeedbackViewActions
      ref="actionsRef"
      :feedback-data="feedbackData"
      :show-on-sides="showActionsOnSides"
    />
    <div
      v-if="showMarkAsClear"
      class="feedback-clear"
    >
      <div
        class="b2"
        v-text="'Accept feedback if everything is clear'"
      />
      <BaseButton
        class="feedback-clear__button"
        type="secondary"
        @click="isMarkAsClearModalOpen = true"
      >
        <BaseSvg
          class="feedback-clear__icon"
          name="checkmark-black"
        />
        Mark as clear
      </BaseButton>
    </div>
    <div class="feedback">
      <div class="feedback__info">
        <BaseAvatar
          class="feedback__author-initial"
          size="md"
          :name="feedbackAuthor.name"
          :picture="feedbackAuthor.picture"
        />
        <div class="feedback__info-wrapper">
          <div class="feedback__author-and-time">
            <div
              class="feedback__author base-typography--bold-button1"
              v-text="feedbackAuthor.name"
            />
            <BaseTimestamp
              class="feedback__time"
              :timestamp="feedbackData.createdAt.seconds"
            />
          </div>
          <div
            class="feedback__title base-typography--b-14-20"
            v-text="feedbackData.title"
          />
        </div>
      </div>
      <div
        class="feedback__content base-typography--b-16-24"
        v-text="feedbackData.content"
      />
    </div>

    <FeedbackComment
      v-for="comment in currentFeedbackComments"
      :id="comment.id"
      :key="comment.id"
      :comment="comment"
      :unseen-comments="unseenComments"
      :feedback-data="feedbackData"
    />

    <WorkspaceWriteComment />

    <WorkspaceMarkAsClearModal
      :show-modal="isMarkAsClearModalOpen"
      :author-name="feedbackAuthor.name"
      @markAsClear="markAsClear"
      @close="isMarkAsClearModalOpen = false"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
 ref, computed, watch, nextTick, toRefs, onMounted,
} from 'vue';
import { updateSeenAt } from '@/firebase';
import { CREATE_ACTION } from '@/constants';
import { SENT_TYPE, CLOSED_STATUS, MARK_CLEAR_ACTION } from '@/constants/feedback';
import { useFeedbackData } from '@/composables/useFeedback';
import WorkspaceWriteComment from './WorkspaceWriteComment.vue';
import FeedbackComment from './FeedbackComment.vue';
import WorkspaceFeedbackViewActions from './WorkspaceFeedbackViewActions.vue';
import WorkspaceMarkAsClearModal from './WorkspaceMarkAsClearModal.vue';

export default {
  components: {
    WorkspaceWriteComment,
    WorkspaceFeedbackViewActions,
    WorkspaceMarkAsClearModal,
    FeedbackComment,
  },
  props: {
    feedbackData: {
      type: Object,
      required: true,
    },
  },
  setup(props, ctx) {
    const store = useStore();
    const router = useRouter();
    const actionsRef = ref(null);

    const {
      feedbackAuthor,
      isFeedbackClosed,
      updateFeedbackStatus,
      addFeedbackAction,
      isFeedbackSent,
      isSelfFeedback,
    } = useFeedbackData(toRefs(props).feedbackData);

    const currentFeedbackComments = computed(() => store.state.feedback.currentFeedbackComments);
    const currentUser = computed(() => store.state.user.userData);
    const unseenComments = ref([]);
    const updateUnseenComments = (id) => {
      setTimeout(() => { unseenComments.value = unseenComments.value.filter((comment) => comment.id !== id); }, 2000);
    };
    const commentObserver = new IntersectionObserver(([entry], observer) => {
        updateSeenAt(currentUser.value.uid, props.feedbackData.id);
        updateUnseenComments(entry.target.id);
        commentObserver.unobserve(entry.target);
      }, {
        threshold: 1.0,
    });
    store.dispatch('feedback/bindCurrentFeedbackComments', props.feedbackData.id);

    const otherParticipantsLastAction = computed(() => {
      if (isSelfFeedback.value) {
        return props.feedbackData.participants[props.feedbackData.authorId].lastAction;
      }

       const { lastAction, name } = Object.entries(props.feedbackData.participants)
        .filter(([id, participant]) => id !== currentUser.value.uid)
        .map(([id, value]) => value)
        .reduce((max, participant) => (
          max.lastAction.createdAt.seconds > participant.lastAction.createdAt.seconds
          ? max
          : participant
        ));

      return lastAction;
    });

    if (!props.feedbackData.participants[currentUser.value.uid].seenAt?.seconds
    || (otherParticipantsLastAction.value.type === CREATE_ACTION
    && otherParticipantsLastAction.value.createdAt.seconds > props.feedbackData.participants[currentUser.value.uid].seenAt?.seconds)) {
      updateSeenAt(currentUser.value.uid, props.feedbackData.id);
    }

    watch(currentFeedbackComments.value, async (newValue) => {
      await nextTick();

      unseenComments.value = newValue
        .map((comment) => [comment, ...(comment.replies ? comment.replies : [])])
        .flat()
        .filter((comment) => (
          comment.createdAt.seconds
            > props.feedbackData.participants[currentUser.value.uid].seenAt?.seconds
            && comment.authorUid !== currentUser.value.uid
        ));
      unseenComments.value.forEach((unseenComment) => {
        commentObserver.observe(document.getElementById(unseenComment.id));
      });
    });

    const showActionsOnSides = ref(false);
    onMounted(() => {
      const scrollContainer = document.querySelector('.workspace__content-container');
      scrollContainer.addEventListener('scroll', () => {
        if (scrollContainer.scrollTop > 30) {
          showActionsOnSides.value = true;
        } else if (scrollContainer.scrollTop < 5) {
          showActionsOnSides.value = false;
        }
      });
    });

    const showMarkAsClear = computed(
      () => (!isFeedbackClosed.value && !isFeedbackSent.value)
        || (!isFeedbackClosed.value && isSelfFeedback.value && router.currentRoute.value.params.type !== SENT_TYPE),
    );
    const isMarkAsClearModalOpen = ref(false);
    const markAsClear = async (message) => {
      await Promise.all([
        updateFeedbackStatus(CLOSED_STATUS),
        addFeedbackAction(MARK_CLEAR_ACTION, message),
      ]);
      isMarkAsClearModalOpen.value = false;
    };
    return {
      showMarkAsClear,
      isFeedbackSent,
      actionsRef,
      isMarkAsClearModalOpen,
      unseenComments,
      currentFeedbackComments,
      feedbackAuthor,
      router,
      showActionsOnSides,
      markAsClear,
      isFeedbackClosed,
    };
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  position: relative;
}

.feedback-view {
  position: relative;
}

.feedback-clear {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  margin-bottom: 12px;
  background: $light;
  border: 1px solid $grey-200;
  border-radius: 10px;

  &__icon {
    width: 20px;
    height: 20px;
    padding: 2px;
    margin-right: 4px;
    stroke: $dark;
  }
}

.feedback {
  padding: 22px 24px;
  background: $light;
  border: $stroke;
  border-radius: $border-radius;

  &__info {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  &__author-and-time {
    display: flex;
    align-items: center;
  }

  &__author {
    margin-right: 8px;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__author-initial {
    margin-right: 12px;
  }

  &__content {
    word-break: break-word;
    white-space: pre-line;
  }
}
</style>
