<template>
  <div class="comment">
    <div class="comment__header base-typography--b-14-20">
      Write comment:
    </div>
    <div class="comment__main">
      <BaseTextarea
        v-model="comment"
        v-shortkey="['ctrl', 'enter']"
        class="comment__textarea"
        rows="5"
        @shortkey.native="addComment"
      />
      <BaseButton
        class="comment__button"
        @click="addComment"
      >
        Comment
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { addComment } from '@/firebase';
import { mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';

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
  validations: {
    comment: {
      required,
    },
  },
  computed: {
    ...mapState('user', ['userData']),
    ...mapState('feedback', ['currentFeedback']),
  },
  methods: {
    addComment() {
      if (this.$v.comment.$invalid) {
        return;
      }
      addComment(this.currentFeedback.id, this.comment, this.userData);
      this.comment = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.comment {
  margin-top: 40px;
  overflow: hidden;
  background: $light;
  border: $stroke;
  border-radius: $border-radius;

  &__header {
    padding: 20px 24px;
    color: $grey-500;
    background: $grey-50;
  }

  &__main {
    display: flex;
    flex-direction: column;
    padding: 12px;
  }

  &__textarea {
    margin-bottom: 10px;
  }

  &__button {
    margin-left: auto;
  }
}
</style>
