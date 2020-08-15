<template>
  <div class="login-form">
    <h5 class="login-form__title stagger">
      Sign up or login
    </h5>
    <p class="login-form__subtitle stagger">
      One email for everything. Sign up or login.
    </p>
    <BaseInput
      ref="input"
      :value="value"
      placeholder="Enter your email"
      label="Your email"
      class="login-form__input stagger"
      :error="error"
      @input="$emit('input', value)"
      @keydown.enter="$emit('submit'), $emit('show-hint')"
    />
    <div
      class="login-form__button-wrapper stagger"
      @mouseenter="$emit('show-hint')"
    >
      <BaseButton
        class="login-form__button"
        :disabled="emailInvalid"
        fluid
        @click="$emit('submit')"
      >
        Continue with email
      </BaseButton>
    </div>
    <!-- eslint-disable -->
      <p class="login-form__terms base-typography--b-14-20 stagger">
        By continuing with Google, Apple, or email, you agree
        to Curiodesk’s <a href="#" class="login-form__terms-link"> Terms of Service</a> and
        <a href="#" class="login-form__terms-link"> Privacy Police</a>.
      </p>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es';

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      required: true,
    },
    emailInvalid: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    anime({
      targets: '.stagger',
      translateY: [-200, 0],
      translateX: [-150, 0],
      rotate: [-30, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: 'spring(1, 100, 15, 20)',
    });
  },
};
</script>

<style lang="scss" scoped>
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
</style>
