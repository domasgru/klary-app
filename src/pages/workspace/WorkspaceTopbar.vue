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
  width: 100%;
  padding: 12px;
  background: $light;
  border-bottom: 1px solid $grey-200;
}
</style>
