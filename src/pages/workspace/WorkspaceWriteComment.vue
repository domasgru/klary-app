<template>
  <BaseTextarea
    v-model="comment"
    placeholder="Leave a comment..."
    class="comment"
    padding="16px 24px"
    rows="3"
    has-submit
    submit-button-text="Send"
    @submit="addComment"
  />
</template>

<script>
import { addAction } from '@/firebase';
import { mapState } from 'vuex';
import { COMMENT_ACTION } from '@/constants/feedback';

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      comment: '',
    };
  },
  computed: {
    ...mapState('user', ['userData']),
  },
  methods: {
    addComment() {
      if (!this.comment) {
        return;
      }

      addAction({
        feedbackId: this.$route.params.id,
        type: COMMENT_ACTION,
        content: this.comment,
        authorUid: this.userData.uid,
      });
      this.comment = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.comment {
  margin-top: 16px;
}
</style>
