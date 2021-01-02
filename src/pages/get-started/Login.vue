<template>
  <div class="signup">
    <div class="signup__header">
      <BaseSvg
        class="signup__logo"
        name="logo"
      />
    </div>
    <div class="signup-wrapper">
      <Signup @success="$router.push('/workspace')" />
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

  &__logo {
    width: 44px;
    height: 24px;
  }
}

.signup-wrapper {
  width: 100%;
  max-width: 592px;
  overflow: hidden;
  border: 1px solid $grey-200;
  border-radius: $border-radius;
}
</style>
