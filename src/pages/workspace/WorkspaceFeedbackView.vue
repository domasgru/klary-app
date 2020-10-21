<template>
  <div class="container--md">
    <div class="feedback">
      <div class="feedback__title base-typography--h6">
        {{ feedbackData.title }}
      </div>
      <div class="feedback__wrapper">
        <div class="feedback__author">
          <BaseAvatar
            class="feedback__author-initial"
            size="sm"
            :name="author.name"
            :picture="author.googlePicture || ''"
          />
          <div class="feedback__author-name base-typography--b-14-20">
            {{ author.name }}
          </div>
        </div>
        <BaseTimestamp :timestamp="feedbackData.createdAt.seconds" />
      </div>
      <div class="feedback__content base-typography--b-16-24">
        {{ feedbackData.content }}
      </div>
    </div>
    <FeedbackComment
      v-for="(comment, index) in currentFeedbackComments"
      :id="comment.id"
      :key="index"
      :ref="comment.id"
      :comment="comment"
    />
    <WorkspaceWriteComment />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {
 getCurrentInstance, ref, computed, watch,
} from '@vue/composition-api';
import { useGetUser } from '@/composables/useGetUser';
import { updateSeenAt } from '@/firebase';
import { FEEDBACK_ACTION_TYPES } from '@/constants';
import WorkspaceWriteComment from './WorkspaceWriteComment.vue';
import FeedbackComment from './FeedbackComment.vue';

export default {
  components: {
    WorkspaceWriteComment,
    FeedbackComment,
  },
  props: {
    feedbackData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { $store, $refs, $route } = getCurrentInstance();
    const currentFeedbackComments = computed(() => $store.state.feedback.currentFeedbackComments);
    const currentUser = computed(() => $store.state.user.userData);
    const author = useGetUser(props.feedbackData.authorId);
    const unseenComments = ref([]);
    const commentObserver = new IntersectionObserver((entries, observer) => {
      console.log('VEIKIU', entries[0]);
        if (!entries[0].isIntersecting) {
          return;
        }
        console.log('fiksuoju');
        updateSeenAt(currentUser.value.uid, props.feedbackData.id);
        commentObserver.unobserve(entries[0].target);
      }, {
        threshold: 1.0,
    });
    $store.dispatch('feedback/bindCurrentFeedbackComments', props.feedbackData.id);

    const otherParticipantsLastAction = computed(() => {
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

    if (otherParticipantsLastAction.value.type === FEEDBACK_ACTION_TYPES.CREATE) {
      updateSeenAt(currentUser.value.uid, props.feedbackData.id);
    }

    watch(currentFeedbackComments, (newValue) => {
      unseenComments.value = newValue
        .map((comment) => [comment, ...(comment.replies ? comment.replies : [])])
        .flat()
        .filter((comment) => (
          comment.createdAt.seconds
            > props.feedbackData.participants[currentUser.value.uid].seenAt?.seconds
            && comment.author.uid !== currentUser.value.uid
        ));
      unseenComments.value.forEach((unseenComment) => {
        console.log(document.getElementById(unseenComment.id));
        commentObserver.observe(document.getElementById(unseenComment.id));
      });
    });
    return {
      currentFeedbackComments,
      author,
    };
  },
};
</script>

<style lang="scss" scoped>
.feedback {
  &__title {
    margin-bottom: 32px;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__author {
    display: flex;
    align-items: center;
  }

  &__author-initial {
    margin-right: 12px;
  }

  &__content {
    padding: 24px;
    background: $light;
    border: $stroke;
    border-radius: $border-radius;
  }
}
</style>
