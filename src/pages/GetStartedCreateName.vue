<template>
  <GetStartedLayout>
    <div class="complete-name">
      <h5 class="complete-name__title stagger">
        Complete your profile
      </h5>
      <p class="complete-name__subtitle stagger">
        Your email <b>{{ userAuth && userAuth.email }}</b>
      </p>
      <div class="complete-name__wrapper">
        <BaseInput
          v-model="name"
          label="Your name"
          placeholder="Enter your name"
          class="complete-name__input stagger"
          :error="error"
          @input="error=''"
          @keydown.enter="createName"
        />
        <BaseCheckbox
          title="I would like to receive newsletters"
          class="complete-name__checkbox stagger"
        />
        <BaseButton
          fluid
          :disabled="$v.name.$invalid"
          class="complete-name__button stagger"
          @click="createName"
        >
          Continue
        </BaseButton>
      </div>
    </div>
  </GetStartedLayout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { required, alpha } from 'vuelidate/lib/validators';
import { updateUserProfileDocument, getInvitedWorkspaces } from '@/firebase';
import GetStartedLayout from '@/pages/GetStartedLayout.vue';

export default {
  components: {
    GetStartedLayout,
  },
  data() {
    return {
      name: '',
      error: '',
      hasInvitaions: false,
    };
  },
  validations: {
    name: {
      required,
      alpha,
    },
  },
  computed: {
    ...mapState('user', ['userAuth', 'userData']),
  },
  async created() {
    const invitedWorkspaces = await getInvitedWorkspaces(this.userData.email);
    this.setInvitedWorkspaces(invitedWorkspaces);

    if (invitedWorkspaces.length) {
      this.hasInvitaions = true;
    }
  },
  methods: {
    ...mapActions('workspace', ['setInvitedWorkspaces']),
    async createName() {
      if (this.$v.name.$invalid) {
        this.error = 'This name is invalid, use only alphabet characters';
        return;
      }

      updateUserProfileDocument(this.userAuth.uid, { name: this.name });
      if (this.hasInvitaions) {
        this.$router.push('/select-workspace');
      } else {
        this.$router.push('/create-team');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.complete-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &__wrapper {
    width: 100%;
    max-width: 470px;
  }

  &__title {
    margin-bottom: 24px;
  }

  &__subtitle {
    margin-bottom: 40px;
  }

  &__input {
    margin-bottom: 18px;
  }

  &__checkbox {
    margin-bottom: 40px;
  }
}
</style>
