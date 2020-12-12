<template>
  <div class="workspace">
    <Sidebar class="workspace__sidebar" />
    <div class="workspace__main">
      <WorkspaceTopbar />
      <div class="workspace__content-container">
        <div class="workspace__content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { logout } from '@/firebase';
import Sidebar from './WorkspaceSidebar.vue';
import WorkspaceTopbar from './WorkspaceTopbar.vue';

export default {
  components: {
    Sidebar,
    WorkspaceTopbar,
  },
  computed: {
    ...mapState('workspace', ['currentWorkspace']),
  },
  methods: {
    ...mapActions('user', ['setUserAuth', 'unbindUser']),
    logoutUser() {
      logout();
      this.setUserAuth(null);
      this.unbindUser();
      this.$router.push('/');
    },
  },
};
</script>
<style lang="scss" scoped>
.workspace {
  display: flex;
  width: 100%;
  height: 100%;
  background: $grey-100;

  &__sidebar {
    flex-basis: 240px;
    flex-shrink: 0;
    height: 100%;
    background: $light;
    border-right: 1px solid $grey-200;
  }

  &__main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-self: flex-start;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  &__content-container {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    padding: 48px 48px 0 48px;
    overflow-y: auto;
  }

  &__content {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 900px;
  }
}
</style>
