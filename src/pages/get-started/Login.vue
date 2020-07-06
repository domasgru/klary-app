<template>
  <div class="login">
    <Header />
    <div
      class="login__container"
      :class="{'login__container--wide': !showForm}"
    >
      <div
        v-show="showForm"
        class="login-form"
      >
        <h5 class="login-form__title stagger">
          Sign up or login
        </h5>
        <p class="login-form__subtitle stagger">
          One email for everything. Sign up or login.
        </p>
        <BaseInput
          ref="input"
          v-model="email"
          placeholder="Enter your email"
          label="Your email"
          class="login-form__input stagger"
          :error="error"
          @input="error=''"
          @keydown.enter="submit(), showHint()"
        />
        <div
          class="login-form__button-wrapper stagger"
          @mouseenter="showHint"
        >
          <BaseButton
            class="login-form__button"
            :disabled="$v.email.$invalid"
            fluid
            @click="submit"
          >
            Continue with email
          </BaseButton>
        </div>
        <!-- eslint-disable -->
      <p class="login-form__terms base-typography--b3 stagger">
        By continuing with Google, Apple, or email, you agree
        to Curiodesk’s <a href="#" class="login-form__terms-link"> Terms of Service</a> and
        <a href="#" class="login-form__terms-link"> Privacy Police</a>.
      </p>
      </div>
      <!-- eslint-enable -->

      <div
        v-show="!showForm"
        class="check-email"
      >
        <h5 class="check-email__title stagger-check-email">
          Check your email!
        </h5>
        <p class="check-email__text1 stagger-check-email">
          We’ve emailed a special link to <b>{{ email }}</b>.
          Click the link to confirm your address and get started.
        </p>
        <!-- eslint-disable -->
        <p class="check-email__text2 stagger-check-email">
          Wrong email? No probs, <span @click="showForm=true" class="login__terms-link">just re-enter your address</span>.
        </p>
        <div class="check-email__links stagger-check-email">
          <a href="https://mail.google.com/" class="check-email__provider">
            <BaseSvg class="check-email__icon" name="gmail"/>
            <p class="base-typography--bb2">Open Gmail</p>
          </a>
          <div class="check-email__provider">
            <BaseSvg class="check-email__icon" name="outlook"/>
            <p class="base-typography--bb2">Open Outlook</p>
          </div>
        </div>
        <p class="check-email__resend base-typography--b3 stagger-check-email">Didn’t receive the emai? <span class="login__terms-link" @click="submit">Resend email</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/ui/HeaderAuth.vue';
import { required, email } from 'vuelidate/lib/validators';
import { login } from '@/firebase';
import { animeStaggerIn, animeStaggerOut } from '@/utils/animation';

export default {
  components: {
    Header,
  },
  data() {
    return {
      email: '',
      error: '',
      showForm: true,
    };
  },
  validations: {
    email: {
      required,
      email,
    },
  },
  watch: {
    showForm(newValue) {
      if (!newValue) {
        animeStaggerIn('.check-email .stagger-check-email');
      }
    },
  },
  methods: {
    showHint() {
      if (!this.$v.email.email) {
        this.error = 'Email is invalid.';
      }
    },
    async submit() {
      if (this.$v.email.$invalid) {
        return;
      }

      login(this.email, '/complete-auth');
      this.showForm = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding-bottom: 12vh;

  @media screen and (min-height: 780px) {
    padding-bottom: 20vh;
  }

  &__container {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 470px;

    &--wide {
      width: 650px;
      text-align: center;
    }
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title,
  .check-email__title {
    margin-bottom: 24px;
  }

  &__subtitle {
    margin-bottom: 40px;
  }

  &__input {
    margin-bottom: 14px;
  }

  &__button-wrapper {
    width: 100%;
  }

  &__button {
    margin-bottom: 24px;
  }

  &__terms {
    line-height: 20px;
    text-align: center;
  }

  &__terms-link {
    color: $primary;
    text-decoration: none;
    cursor: pointer;
  }
}

.check-email {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__links {
    display: flex;
    justify-content: space-between;
    width: 360px;
    margin-bottom: 32px;
  }

  &__text1 {
    margin-bottom: 16px;
  }

  &__text2 {
    margin-bottom: 64px;
  }

  &__provider {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__icon {
    width: 28px;
    height: 28px;
    margin-right: 18px;
  }

  &__resend {
    color: $grey-400;
  }
}
</style>
