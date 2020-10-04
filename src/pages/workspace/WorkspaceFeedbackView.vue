<template>
  <div class="container--md">
    <div class="feedback">
      <div class="feedback__title base-typography--h6">
        {{ currentFeedback.title }}
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
        <BaseTimestamp :timestamp="currentFeedback.createdAt.seconds" />
      </div>
      <div class="feedback__content base-typography--b-16-24">
        {{ currentFeedback.content }}
      </div>
    </div>
    <FeedbackComment
      v-for="(comment, index) in currentFeedbackComments"
      :key="index"
      :comment="comment"
    />
    <WorkspaceWriteComment />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { getCurrentInstance, computed } from '@vue/composition-api';
import { useGetUser } from '@/composables/useGetUser';
import WorkspaceWriteComment from './WorkspaceWriteComment.vue';
import FeedbackComment from './FeedbackComment.vue';

export default {
  components: {
    WorkspaceWriteComment,
    FeedbackComment,
  },
  setup() {
    const { $store } = getCurrentInstance();
    const currentFeedback = computed(() => $store.state.feedback.currentFeedback);
    const currentFeedbackComments = computed(() => $store.state.feedback.currentFeedbackComments);
    const author = useGetUser(currentFeedback.value.authorId);
    $store.dispatch('feedback/bindCurrentFeedbackComments', currentFeedback.value.id);

    return {
      currentFeedback,
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
