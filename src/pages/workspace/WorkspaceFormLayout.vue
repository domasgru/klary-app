<template>
  <div class="layout">
    <slot name="header" />
    <!-- <div class="layout__cover" /> -->
    <slot />
    <div class="layout__content">
      <div class="layout__container">
        <slot name="content" />
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
  padding-bottom: 120px;
  background: $grey-100;

  &__cover {
    width: 100%;
    height: 320px;
    background: linear-gradient(180deg, rgba(245, 245, 247, 0) 0%, #f5f5f7 100%), linear-gradient(267.05deg, #8ec5fc 0%, #e0c3fc 100%);
  }

  &__content {
    // margin-top: -160px;

    @media screen and (max-width: 836px) {
      padding: 0 16px;
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 788px;
    margin: 0 auto;
  }
}
</style>
