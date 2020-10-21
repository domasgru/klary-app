<template>
  <div class="loader">
    <div class="loader__animation">
      <BaseSvg
        class="loader__logo"
        name="logo"
      />
    </div>
  </div>
</template>

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
