<template>
  <GetStartedLayout>
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
          @keydown.enter="createWorkspace"
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
  </GetStartedLayout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { required, alphaNum } from '@vuelidate/validators';
import { db, updateUserProfileDocument, createWorkspace } from '@/firebase';
import GetStartedLayout from '@/pages/GetStartedLayout.vue';

export default {
  components: {
    GetStartedLayout,
  },
  data() {
    return {
      name: '',
      error: '',
    };
  },
  validations() {
    return {
      name: {
        required,
        alphaNum,
      },
    };
  },
  computed: {
    ...mapState('user', ['userAuth']),
  },
  methods: {
    ...mapActions('workspace', ['setAllWorkspaces', 'setCurrentWorkspace']),
    async createWorkspace() {
      this.$v.$touch();
      if (this.$v.name.$invalid) {
        this.error = 'This name is invalid, use only alphanumeric characters';
        return;
      }

      const { data, id } = await createWorkspace(this.userAuth.uid, this.name);
      this.setAllWorkspaces([id]);
      updateUserProfileDocument(this.userAuth.uid, { currentWorkspace: id });
      this.setCurrentWorkspace(data);
      this.$router.push('/invite-team');
    },
  },
};
</script>

<style lang="scss" scoped>
.complete-company {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &__wrapper {
    width: 100%;
    max-width: 470px;
  }

  &__title {
    width: 100%;
    max-width: 770px;
    margin-bottom: 40px;
  }

  &__input {
    margin-bottom: 26px;
  }
}
</style>
