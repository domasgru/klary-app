<template>
  <div class="content">
    <div class="navigation">
      <BaseSvg
        class="navigation__logo"
        name="logo"
      />
      <BaseButton @click="$router.push('/workspace')">
        Login
      </BaseButton>
    </div>
    <div class="container">
      <h2>The best platform to give feedback</h2>
    </div>
  </div>
</template>
<script>
export default {

};
</script>
<style lang="scss" scoped>
.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 23px 56px;
  background: $light;

  &__logo {
    width: 120px;
    height: 26px;
  }
}

.container {
  width: 1224px;
  padding-top: 120px;
  margin: auto;
}
</style>
