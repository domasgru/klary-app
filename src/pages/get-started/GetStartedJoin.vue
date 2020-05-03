<template>
  <div>
    <h1>Lets join your team!</h1>
    <h3>Now enter your email</h3>
    <input
      v-model="email"
      type="text"
    >
    <BaseButton @click="login">
      Verify email
    </BaseButton>
  </div>
</template>

<script>
import Firebase from '@/firebaseConfig';

export default {
  data() {
    return {
      email: '',
    };
  },
  methods: {
    login() {
      Firebase.login(this.email);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
