<template>
  <div class="signup">
    <div class="signup__header">
      <BaseLogo />
    </div>
    <div class="welcome-modal">
      <Signup @success="$router.push('/')" />
    </div>
  </div>
</template>

<script>
import Signup from '@/pages/Signup.vue';

export default {
  components: {
    Signup,
  },
};
</script>

<style lang="scss" scoped>
.signup {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 24px;
  background: $grey-100;

  &__header {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 20px 24px;
  }

  &__ellipse1 {

  }
}

.welcome-modal {
  width: 100%;
  max-width: 592px;
  padding: 56px 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid $grey-200;
  border: 5px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
}
</style>
