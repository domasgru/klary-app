<template>
  <h4 class="title h4">
    Favorites
  </h4>
  <WorkspaceInboxEmptyState
    title="Highlight specific parts in feedbacks"
    illustration="highlights-il"
  >
    <div class="label overline">
      Coming soon
    </div>
  </WorkspaceInboxEmptyState>
</template>

<script>
import WorkspaceInboxEmptyState from './WorkspaceInboxEmptyState.vue';

  export default {
components: {
  WorkspaceInboxEmptyState,
},
  };
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 32px;
}

.label {
  padding: 4px 8px;
  color: $primary;
  background: $primary-active-input;
  border-radius: 59px;
}
</style>
