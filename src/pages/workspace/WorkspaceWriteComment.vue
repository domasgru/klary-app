<template>
  <BaseTextarea
    v-model="comment"
    placeholder="Leave a comment..."
    class="comment"
    padding="16px 24px"
    rows="5"
    has-submit
    submit-button-text="Comment"
    @submit="addComment"
  />
</template>

<script>
import { addComment } from '@/firebase';
import { mapState } from 'vuex';
import { required } from '@vuelidate/validators';

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
  validations() {
    return {
      comment: {
        required,
      },
    };
  },
  computed: {
    ...mapState('user', ['userData']),
  },
  methods: {
    addComment() {
      try {
        this.$v.$touch();
        if (this.$v.comment.$invalid) {
          return;
        }
      } catch (e) {
        console.log(e);
      }

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
