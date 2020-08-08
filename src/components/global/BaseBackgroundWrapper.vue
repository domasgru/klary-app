<template>
  <div class="base-background-wrapper">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.base-background-wrapper {
  background: $light;
  border: $stroke;
  border-radius: 10px;
}
</style>
