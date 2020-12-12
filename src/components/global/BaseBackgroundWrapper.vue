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
  box-shadow: 0 10px 15px -3px rgba(23, 23, 26, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
