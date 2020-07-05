<template>
  <div class="loader">
    <div class="loader__animation">
      <LottiePlayer
        :src="animationJSON"
        :options="{autoplay: true, loop: true, width: '176px', height: '176px'}"
      />
      <BaseSvg
        class="loader__logo"
        name="logo"
      />
    </div>
  </div>
</template>

<script>
import animationJSON from '@/assets/lottie/loader.json';

export default {
  data() {
    return {
      animationJSON,
    };
  },
};
</script>

<style lang="scss" scoped>
.loader {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: white;

  &__animation {
    position: relative;
  }

  &__logo {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 80px;
    margin: auto;
  }
}
</style>
