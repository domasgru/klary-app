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
      v-for="comment in currentFeedbackComments"
      :id="comment.id"
      :key="comment.id"
      :comment="comment"
      :unseen-comments="unseenComments"
    />
    <WorkspaceWriteComment />
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
 ref, computed, watch, nextTick,
} from 'vue';
import { useGetUser } from '@/composables/useGetUser';
import { updateSeenAt } from '@/firebase';
import { CREATE_ACTION } from '@/constants';
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
    const store = useStore();
    const router = useRouter();
    const currentFeedbackComments = computed(() => store.state.feedback.currentFeedbackComments);
    const currentUser = computed(() => store.state.user.userData);
    const author = useGetUser(props.feedbackData.authorId);
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
            && comment.author.uid !== currentUser.value.uid
        ));
      unseenComments.value.forEach((unseenComment) => {
        commentObserver.observe(document.getElementById(unseenComment.id));
      });
    });
    return {
      unseenComments,
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
