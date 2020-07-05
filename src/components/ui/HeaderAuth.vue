<template>
  <div class="header-auth">
    <BaseSvg
      class="header-auth__logo"
      name="logo"
    />
  </div>
</template>

<style lang="scss" scoped>
.header-auth {
  display: flex;
  justify-content: center;
  padding: 40px 0;

  &__logo {
    width: 120px;
    height: 26px;
    cursor: pointer;
  }
}
</style>
