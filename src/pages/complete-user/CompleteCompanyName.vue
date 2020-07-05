<template>
  <div class="complete-company">
    <h5 class="complete-company__title stagger">
      What’s the name of your company or team?
    </h5>
    <div class="complete-company__wrapper">
      <BaseInput
        v-model="name"
        label="Your company or team name"
        placeholder="Enter your company or team name"
        class="complete-company__input stagger"
        :error="error"
        @input="error=''"
        @keydown.enter="createWorkspace()"
      />
      <BaseButton
        fluid
        :disabled="$v.name.$invalid"
        class="complete-company__button stagger"
        @click="createWorkspace"
      >
        Continue
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { required, alphaNum } from 'vuelidate/lib/validators';
import { db, updateUserProfileDocument, getWorkspace } from '@/firebase';
import { animeStaggerIn, animeStaggerOut } from '@/utils/animation';

export default {
  data() {
    return {
      name: '',
      error: '',
    };
  },
  validations: {
    name: {
      required,
      alphaNum,
    },
  },
  computed: {
    ...mapState('user', ['userAuth']),
  },
  mounted() {
    animeStaggerIn();
  },
  methods: {
    ...mapActions('workspace', ['setAllWorkspaces', 'setCurrentWorkspace']),
    async createWorkspace() {
      if (this.$v.name.$invalid) {
        this.error = 'This name is invalid, use only alphanumeric characters';
        return;
      }
      const workspaceId = this.name.toLowerCase();
      const workspaceRef = db.doc(`workspaces/${workspaceId}`);
      const workspace = await workspaceRef.get();
      if (workspace.exists) {
        this.error = 'Workspace or team with this name already exists';
        return;
      }

      await workspaceRef.set({
        name: this.name,
        team: [this.userAuth.uid],
      });

      const currentWorkspace = await getWorkspace(workspaceId);
      await animeStaggerOut();
      this.setAllWorkspaces([workspaceId]);
      updateUserProfileDocument(this.userAuth.uid, { currentWorkspace: workspaceId });
      this.setCurrentWorkspace(currentWorkspace);
    },
  },
};
</script>

<style lang="scss" scoped>
.complete-company {
  text-align: center;

  &__wrapper {
    padding: 0 50px;
  }

  &__title {
    margin-bottom: 40px;
  }

  &__input {
    margin-bottom: 26px;
  }
}
</style>
