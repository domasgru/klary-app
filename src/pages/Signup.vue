<template>
  <div
    v-if="step === 'welcome'"
    class="welcome-content"
  >
    <div class="h4 title">
      Welcome to Kuri
    </div>
    <div class="b1 subtitle">
      Use your Google account to sign up or log in.
    </div>
    <button
      class="button-google btn1s"
      @click="loginGoogle"
    >
      <BaseSvg
        class="google-icon"
        name="google"
      />
      Continue with Google
    </button>
    <div class="terms b2">
      By continuing, you agree to our
      <BaseButton is-inline>
        Terms of Service
      </BaseButton>
      and
      <BaseButton is-inline>
        Privacy Policy
      </BaseButton>.
    </div>
  </div>
  <div
    v-else-if="step === 'name'"
    class="name-content"
  >
    <div class="h4 name-content__title">
      Enter your full name
    </div>
    <BaseInput
      v-model="fullName"
      label="Your full name"
      placeholder="Name Username"
      class="name-content__input"
      size="lg"
      autofocus
    />
    <BaseButton
      size="lg"
      is-fluid
      @click="createFullName"
      v-text="completionText"
    />
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { loginWithGoogle, createUserProfileDocument } from '@/firebase';
import { handleLoginAndReturnRedirect } from '@/utils/handleLogin';
import { mapActions, mapState } from 'vuex';

export default {
  props: {
    completionText: {
      type: String,
      default: 'Finish sign up',
    },
  },
  emits: ['success', 'error'],
  data() {
    return {
      step: 'welcome',
      fullName: '',
    };
  },
  computed: {
    ...mapState('user', ['userAuth', 'userData']),
  },
  methods: {
    ...mapActions('user', ['setUserAuth', 'bindUser']),
    async loginGoogle() {
      try {
        const { user, additionalUserInfo } = await loginWithGoogle();
        this.setUserAuth({ email: user.email, uid: user.uid, additionalUserInfo });
        await this.bindUser(user.uid);

        if (additionalUserInfo.isNewUser || !this.userData) {
          const { name, given_name } = additionalUserInfo.profile;
          this.fullName = name || given_name || '';
          this.step = 'name';
          return;
        }

        this.$emit('success');
      } catch (e) {
        this.$emit('error');
        console.error(e);
      }
    },
    async createFullName() {
      const picture = this.userAuth.additionalUserInfo.profile?.picture
        ? { picture: this.userAuth.additionalUserInfo.profile?.picture } : {};
      await createUserProfileDocument(this.userAuth, {
        ...picture,
        name: this.fullName,
        status: 'NEW',
      });
      this.$emit('success');
    },
  },
};
</script>

<style lang="scss" scoped>
.google-icon {
  width: 24px;
  height: 24px;
  padding: 2px;
  margin-right: 8px;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.title {
  margin-bottom: 16px;
}

.subtitle {
  margin-bottom: 40px;
}

.button-google {
  display: flex;
  align-items: center;
  padding: 11px 98px;
  margin-bottom: 40px;
  cursor: pointer;
  border: 1px solid $grey-200;
  border-radius: $border-radius;
  transition: 0.2s ease;

  &:hover {
    background: $grey-100;
  }

  &:active {
    background: $grey-150;
  }
}

.terms {
  max-width: 244px;
}

.name-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 384px;
  margin: auto;
  text-align: center;

  &__title {
    margin-bottom: 40px;
  }

  &__input {
    margin-bottom: 40px;
  }
}
</style>
