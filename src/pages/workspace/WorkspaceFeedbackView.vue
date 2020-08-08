<template>
  <div class="container--md">
    <div class="feedback">
      <div class="feedback__title base-typography--h6">
        {{ currentFeedback.title }}
      </div>
      <div class="feedback__wrapper">
        <div class="feedback__author">
          <BaseInitial
            class="feedback__author-initial"
            size="sm"
            :name="currentFeedback.author.fullName"
          />
          <div class="feedback__author-name base-typography--b3">
            {{ currentFeedback.author.fullName }}
          </div>
        </div>
        <BaseTimestamp :timestamp="currentFeedback.createdAt.seconds" />
      </div>
      <div class="feedback__content base-typography--b2">
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
import WorkspaceWriteComment from './WorkspaceWriteComment.vue';
import FeedbackComment from './FeedbackComment.vue';

export default {
  components: {
    WorkspaceWriteComment,
    FeedbackComment,
  },
  computed: {
    ...mapState('feedback', ['currentFeedback', 'currentFeedbackComments']),
  },
  created() {
    this.bindCurrentFeedbackComments(this.currentFeedback.id);
  },
  methods: {
    ...mapActions('feedback', ['bindCurrentFeedbackComments']),
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
