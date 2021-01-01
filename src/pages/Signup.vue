<template>
  <div class="top">
    <div class="h4 title">
      {{ texts.title }}
    </div>
    <div class="b1 subtitle">
      {{ texts.subtitle }}
    </div>
    <button
      class="button-google btn1s"
      @click="loginGoogle"
    >
      <BaseSvg
        class="google-icon"
        name="google"
      />
      {{ texts.button }}
    </button>
    <div class="terms b2">
      By logging in, you agree to our
      <BaseButton is-inline>
        Terms of Service
      </BaseButton>
      and
      <BaseButton is-inline>
        Privacy Policy
      </BaseButton>.
    </div>
  </div>
  <div class="bottom btn2">
    {{ texts.switch }}
    <BaseButton
      is-inline
      @click="switchMethod"
    >
      {{ texts.switchAction }}
    </BaseButton>
  </div>
</template>

<script>
import { loginWithGoogle } from '@/firebase';
import { handleLoginAndReturnRedirect } from '@/utils/handleLogin';

const SIGNUP_TEXTS = {
  title: 'Sign up',
  subtitle: 'Use your google account to sign up',
  button: 'Sign up with Google',
  switch: 'Already have an account?',
  switchAction: 'Log in',
};
const LOGIN_TEXTS = {
  title: 'Log in',
  subtitle: 'Use your Google account to log in.',
  button: 'Sign in with Google',
  switch: "Don't have an account?",
  switchAction: 'Sign up',
};

export default {
 data() {
   return {
     isSignup: true,
   };
 },
 computed: {
   texts() {
     return this.isSignup ? SIGNUP_TEXTS : LOGIN_TEXTS;
   },
 },
 methods: {
   switchMethod() {
     this.isSignup = !this.isSignup;
   },
   async loginGoogle() {
     try {
      const result = await loginWithGoogle();
      await handleLoginAndReturnRedirect(result);
      this.$emit('success');
     } catch (e) {
       console.error(e);
     }
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

.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 56px 24px 56px;
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
  padding: 12px 98px;
  margin-bottom: 40px;
  cursor: pointer;
  border: 1px solid $grey-200;
  border-radius: $border-radius;
}

.terms {
  max-width: 244px;
}

.bottom {
  padding: 30px;
  text-align: center;
  background: $grey-100;
}
</style>
