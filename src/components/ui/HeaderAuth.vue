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
  padding: 32px 0;

  &__logo {
    width: 116px;
    height: 26px;
    cursor: pointer;
  }
}
</style>
