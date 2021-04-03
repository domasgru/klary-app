<template>
  <div class="layout">
    <slot name="header" />
    <div class="layout__cover" />
    <slot />
    <div class="layout__content">
      <div class="layout__container">
        <slot name="form" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  width: 100%;
  min-height: 100%;
  background: $grey-100;
  padding-bottom: 120px;

  &__cover {
    height: 200px;
    width: 100%;
    background: linear-gradient(267.05deg, #8EC5FC 0%, #E0C3FC 100%);
  }

   &__content{
    margin-top: -56px;
  }

  &__container {
    max-width: 728px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
