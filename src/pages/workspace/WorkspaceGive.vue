<template>
  <div class="container--md">
    <div class="give__title base-typography--h6">
      Give feedback
    </div>
    <BaseBackgroundWrapper class="give__wrapper">
      <WorkspaceSelectTeamate
        v-model="userInput"
        label="To"
        class="give__to"
        @select="selectUser"
        @input="t"
      />
      <BaseInput
        v-model="title"
        class="give__feedback-title"
        label="Feedback title"
        hint="Specify what feedback you are writing."
      />
      <BaseInput
        v-model="content"
        type="textarea"
        class="give__content"
        rows="4"
        label="Your feedback"
        placeholder="Always be candid when writing feedback."
      />
      <BaseButton
        class="give__submit"
        @click="sendFeedback"
      >
        Send feedback
      </BaseButton>
    </BaseBackgroundWrapper>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { createFeedback } from '@/firebase';
import WorkspaceSelectTeamate from './WorkspaceSelectTeamate.vue';

export default {
  components: {
    WorkspaceSelectTeamate,
  },
  data() {
    return {
      userInput: '',
      selectedUser: null,
      title: '',
      content: '',
    };
  },
  computed: {
    ...mapState('user', ['userData']),
    ...mapState('workspace', ['currentWorkspace']),
  },
  created() {
    this.title = `Feedback from ${this.userData.name}`;
  },
  methods: {
    selectUser(user) {
      this.selectedUser = user;
      this.userInput = user.name;
    },
    sendFeedback() {
      createFeedback({
        authorId: this.userData.uid,
        receiverId: this.selectedUser.uid,
        workspaceId: this.currentWorkspace.id,
        author: this.userData,
        receiver: this.selectedUser,
        title: this.title,
        content: this.content,
      });
    },
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
