<template>
  <div class="container--md">
    <div class="give__title base-typography--h6">
      Give feedback
    </div>
    <BaseBackgroundWrapper class="give__wrapper">
      <WorkspaceSelectTeamate
        label="To"
        class="give__to"
      />
      <BaseInput
        v-model="title"
        class="give__feedback-title"
        label="Feedback title"
        hint="Specify what feedback you are writing."
      />
      <BaseTextarea
        v-model="content"
        class="give__content"
        rows="4"
        label="Your feedback"
        placeholder="Always be candid when writing feedback."
      />
      <BaseButton class="give__submit">
        Send feedback
      </BaseButton>
    </BaseBackgroundWrapper>
  </div>
</template>

<script>
import WorkspaceSelectTeamate from './WorkspaceSelectTeamate.vue';

export default {
  components: {
    WorkspaceSelectTeamate,
  },
  data() {
    return {
      title: '',
      content: '',
    };
  },
};
</script>

<style lang="scss" scoped>
.give {
  &__wrapper {
    display: flex;
    flex-direction: column;
    padding: 28px 32px;
  }

  &__title {
    margin-bottom: 32px;
  }

  &__to {
    margin-bottom: 22px;
  }

  &__feedback-title {
    margin-bottom: 40px;
  }

  &__submit {
    margin-left: auto;
  }
}
</style>
