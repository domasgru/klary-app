<template>
  <GetStartedLayout>
    <h5 class="select-workspace__title">
      Your feedback spaces
    </h5>
    <p class="select-workspace__subtitle">
      You are already a member of these spaces:
    </p>
    <div class="workspace-cards">
      <SelectWorkspaceCard
        v-for="workspace in invitedWorkspaces"
        :key="workspace.name"
        :workspace="workspace"
        is-new
        @open="openWorkspace(workspace.id)"
      />
      <SelectWorkspaceCard
        v-for="workspace in allWorkspaces"
        :key="workspace.name"
        :workspace="workspace"
        @open="openWorkspace(workspace.id)"
      />
    </div>
    <BaseLink to="/create-workspace">
      + Create new feedback-space
    </BaseLink>
  </GetStartedLayout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import GetStartedLayout from '@/pages/GetStartedLayout.vue';
import SelectWorkspaceCard from '@/components/ui/SelectWorkspaceCard.vue';

export default {
  components: {
    GetStartedLayout,
    SelectWorkspaceCard,
  },
  computed: {
    ...mapState('workspace', ['allWorkspaces', 'invitedWorkspaces']),
  },
  methods: {
    ...mapActions('workspace', ['setCurrentWorkspace']),
    openWorkspace(id) {
      const currentWorkspace = this.allWorkspaces.find((workspace) => workspace.id === id);
      this.setCurrentWorkspace(currentWorkspace);
      this.$router.push('/workspace');
    },
  },
};
</script>

<style lang="scss" scoped>
.select-workspace {
  &__title {
    margin-bottom: 24px;
  }

  &__subtitle {
    margin-bottom: 56px;
  }
}

.new-workspace-card {
  display: flex;
  align-items: center;
  width: 602px;
  padding: 16px;
  margin-bottom: 48px;
  color: $light;
  background: $primary;
  border: 1px solid $grey-200;
  border-radius: 10px;
}
</style>
