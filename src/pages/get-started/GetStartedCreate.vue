<template>
  <div>
    <h1>Enter your email</h1>
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
