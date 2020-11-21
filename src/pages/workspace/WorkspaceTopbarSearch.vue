<template>
  <div class="search-indicator base-typography--b-14-20">
    <BaseSvg
      class="search-indicator__icon"
      name="search"
    />
    Search
    <div class="search-indicator__shortcut">
      ⌘+K
    </div>
  </div>
</template>

<script>
  export default {

  };
</script>

<style lang="scss" scoped>
.search-indicator {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 248px;
  padding: 10px 8px;
  color: $grey-500;
  background: $light;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    cursor: pointer;
    background: $grey-100;
  }

  &__icon {
    width: 20px;
    height: 20px;
    padding: 4px;
    margin-right: 8px;
  }

  &__shortcut {
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover &__shortcut {
    opacity: 1;
  }
}
</style>
