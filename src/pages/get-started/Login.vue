<template>
  <div class="signup">
    <BaseSvg
      class="ellipse-left"
      name="ellipsis-left"
    />
    <BaseSvg
      class="ellipse-right"
      name="ellipsis-right"
    />
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
  overflow: hidden;
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

  .ellipse-left {
    position: absolute;
    bottom: -330px;
    left: -410px;
    z-index: 0;
    width: 1000px;
    height: 1000px;
    animation: float-left 15s ease infinite;
  }

  .ellipse-right {
    position: absolute;
    top: -370px;
    right: -250px;
    z-index: 0;
    width: 1000px;
    height: 1000px;
    animation: float-right 15s ease infinite;
  }
}

.welcome-modal {
  z-index: 1;
  width: 100%;
  max-width: 592px;
  padding: 56px 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid $grey-200;
  border: 5px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
}

@keyframes float-right {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(60%);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes float-left {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-60%);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
