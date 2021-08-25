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
        <BaseIcon
          size="sm"
          class="feedback-clear__icon"
          name="check"
        />
        Mark as clear
      </BaseButton>
    </div>

    <WorkspaceFeedbackForm
      :feedback-request-data="feedbackData.form"
      view-mode="view"
      class="feedback-view__form"
    />

    <div class="overline feedback-view__discussion-title">
      Discussion
    </div>

    <WorkspaceFeedbackAction
      v-for="(action, index) in currentFeedbackActions"
      :key="action.id"
      :action="action"
      :index="index"
      :unseen-actions="unseenActions"
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
import WorkspaceFeedbackAction from './WorkspaceFeedbackAction.vue';
import WorkspaceFeedbackViewActions from './WorkspaceFeedbackViewActions.vue';
import WorkspaceMarkAsClearModal from './WorkspaceMarkAsClearModal.vue';
import WorkspaceFeedbackForm from './WorkspaceFeedbackForm.vue';

export default {
  components: {
    WorkspaceWriteComment,
    WorkspaceFeedbackViewActions,
    WorkspaceMarkAsClearModal,
    WorkspaceFeedbackAction,
    WorkspaceFeedbackForm,
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

    const currentFeedbackActions = computed(() => store.state.feedback.currentFeedbackActions);
    const currentUser = computed(() => store.state.user.userData);
    const unseenActions = ref([]);
    const updateUnseenActions = (id) => {
      setTimeout(() => { unseenActions.value = unseenActions.value.filter((comment) => comment.id !== id); }, 2000);
    };
    const commentObserver = new IntersectionObserver(([entry], observer) => {
      updateSeenAt(currentUser.value.uid, props.feedbackData.id);
      updateUnseenActions(entry.target.id);
      commentObserver.unobserve(entry.target);
    }, {
      threshold: 1.0,
    });
    store.dispatch('feedback/bindCurrentFeedbackActions', props.feedbackData.id);

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

    watch(currentFeedbackActions.value, async (newValue) => {
      await nextTick();

      unseenActions.value = newValue
        .map((comment) => [comment, ...(comment.replies ? comment.replies : [])])
        .flat()
        .filter((comment) => (
          comment.createdAt.seconds
            > props.feedbackData.participants[currentUser.value.uid].seenAt?.seconds
            && comment.authorUid !== currentUser.value.uid
        ));
      unseenActions.value.forEach((unseenComment) => {
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
      unseenActions,
      currentFeedbackActions,
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

  &__form {
    margin-bottom: 48px;
  }

  &__discussion-title {
    margin-bottom: 16px;
    color: $grey-600;
  }
}

.feedback-clear {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  margin-bottom: 16px;
  background: $light;
  border: 1px solid $grey-200;
  border-radius: 10px;

  &__icon {
    margin-right: 4px;
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
