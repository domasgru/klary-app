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
    height: 320px;
    width: 100%;
    background: linear-gradient(180deg, rgba(245, 245, 247, 0) 0%, #F5F5F7 100%), linear-gradient(267.05deg, #8EC5FC 0%, #E0C3FC 100%);
  }

   &__content{
    margin-top: -160px;
  }

  &__container {
    max-width: 788px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
