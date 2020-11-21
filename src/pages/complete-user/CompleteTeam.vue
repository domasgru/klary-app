<template>
  <div class="complete-company">
    <h5 class="complete-company__title stagger">
      Invite your teammates to this new feedback-space 🙌
    </h5>
    <div class="complete-company__wrapper">
      <BaseTextarea
        v-model="emails"
        label="Emails"
        class="complete-company__input stagger"
        placeholder="Ex. justin@work-inc.com, dominic@work-inc.com"
      />
      <BaseButton
        fluid
        :disabled="$v.emails.$invalid"
        class="complete-company__button stagger"
        @click="addTeamates"
      >
        Add teammate
      </BaseButton>
      <p
        class="complete-company__skip base-typography--b-16-24"
        @click="$router.push('/workspace')"
      >
        Or, <b>skip for now</b>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { required } from '@vuelidate/validators';
import { db, updateUserProfileDocument, FieldValue } from '@/firebase';

export default {
  data() {
    return {
      emails: '',
      error: '',
    };
  },
  validations() {
    return {
      emails: {
        required,
      },
    };
  },
  computed: {
    ...mapState('user', ['userData']),
  },
  methods: {
    ...mapActions('workspace', ['setAllWorkspaces', 'setCurrentWorkspace']),
    async addTeamates() {
      const workspaceRef = db.doc(`workspaces/${this.userData.currentWorkspace}`);
      const emails = this.emails.trim().split(',');
      await workspaceRef.update({
        invited: emails,
      });

      this.$router.push('/workspace');
    },
  },
};
</script>

<style lang="scss" scoped>
.complete-company {
  text-align: center;

  &__wrapper {
    padding: 0 149px;
  }

  &__title {
    width: 770px;
    margin-bottom: 40px;
  }

  &__input {
    margin-bottom: 26px;
  }

  &__button {
    margin-bottom: 40px;
  }

  &__skip {
    b {
      color: $primary;
      cursor: pointer;
    }
  }
}
</style>
