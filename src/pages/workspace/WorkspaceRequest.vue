<template>
  <div class="container--md">
    <div class="request__title base-typography--h6">
      Request feedback
    </div>
    <div class="request__form">
      <WorkspaceSelectTeamate
        v-model="userInput"
        type="multi-select"
        label="From"
        class="request__input"
        :selected-users="selectedUsers"
        @select="selectUser"
        @remove="removeUser"
      />
      <BaseTextarea
        v-model="message"
        class="request__message"
        label="Message"
        hint="Specify what kind of feedback you are asking for."
        rows="4"
      />
      <BaseButton
        class="request__submit"
        :disabled="!isFormValid"
        @click="sendRequest"
      >
        Send request
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { createFeedbackRequest } from '@/firebase';
import anime from 'animejs/lib/anime.es';
import WorkspaceSelectTeamate from './WorkspaceSelectTeamate.vue';

export default {
  components: {
    WorkspaceSelectTeamate,
  },
  data() {
    return {
      userInput: '',
      selectedUsers: [],
      message: 'I’m gathering professional feedback from a handful of my peers to help me learn my strengths and opportunities to improve. I’m using a new app called Kuri and it should only take a few minutes.',
    };
  },
  computed: {
    ...mapState('user', ['userData']),
    ...mapState('workspace', ['currentWorkspace']),
    isFormValid() {
      return !!this.selectedUsers.length;
    },
  },
  methods: {
    selectUser(user) {
      this.userInput = '';
      this.selectedUsers = [...this.selectedUsers, user];
    },
    removeUser(uid) {
      this.selectedUsers = this.selectedUsers.filter((user) => user.uid !== uid);
    },
    sendRequest() {
      createFeedbackRequest({
        from: { name: this.userData.name, uid: this.userData.uid },
        to: { name: this.selectedUser.name, uid: this.selectedUser.uid },
        message: this.message,
        workspaceId: this.currentWorkspace.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.request {
  &__title {
    margin-bottom: 32px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    padding: 28px 32px;
    background: $light;
    border: $stroke;
    border-radius: 10px;
  }

  &__input {
    margin-bottom: 22px;
  }

  &__message {
    margin-bottom: 32px;
  }

  &__submit {
    margin-left: auto;
  }
}
</style>
