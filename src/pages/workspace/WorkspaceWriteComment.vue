<template>
  <BaseTextarea
    v-model="comment"
    placeholder="Leave a comment..."
    class="comment"
    padding="16px 24px"
    rows="3"
    has-submit
    submit-button-text="Send"
    autofocus
    @submit="addComment"
  />
</template>

<script>
import { addComment } from '@/firebase';
import { mapState } from 'vuex';

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
      addComment(this.$route.params.id, this.comment, this.userData);
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
