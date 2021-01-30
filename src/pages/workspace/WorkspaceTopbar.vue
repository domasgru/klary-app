<template>
  <div class="base-topbar">
    <WorkspaceTopbarSearch />
  </div>
</template>

<script>
import WorkspaceTopbarSearch from './WorkspaceTopbarSearch.vue';

export default {
  components: {
    WorkspaceTopbarSearch,
  },
};
</script>

<style lang="scss" scoped>
.base-topbar {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid $grey-200;
  backdrop-filter: blur(10px);
}
</style>
