<template>
  <div class="check-mail">
    <h5 class="check-email__title">
      Check your email!
    </h5>
    <p class="check-email__text1">
      We’ve emailed a special link to <b>{{ email }}</b>.
      Click the link to confirm your address and get started.
    </p>
    <!-- eslint-disable -->
        <p class="check-email__text2">
          Wrong email? No probs, <span @click="$emit('show-form')" class="login__terms-link">just re-enter your address</span>.
        </p>
        <div class="check-email__links">
          <a href="https://mail.google.com/" class="check-email__provider">
            <BaseSvg class="check-email__icon" name="gmail"/>
            <p class="base-typography--bb2">Open Gmail</p>
          </a>
          <div class="check-email__provider">
            <BaseSvg class="check-email__icon" name="outlook"/>
            <p class="base-typography--bb2">Open Outlook</p>
          </div>
        </div>
        <p class="check-email__resend base-typography--b3">Didn’t receive the emai? <span class="login__terms-link" @click="$emit('resend')">Resend email</span></p>
  </div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.check-email {
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
