<template>
  <div class="workspace">
    <Sidebar class="workspace__sidebar" />
    <div class="workspace__main">
      <WorkspaceTopbar />
      <div
        ref="scrollContainerRef"
        class="workspace__content-container"
      >
        <div class="workspace__content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
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
  mounted() {
    try {
      this.setScrollContainerRef('error', this.$refs.scrollContainerRef);
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    ...mapActions('user', ['setUserAuth', 'unbindUser']),
    ...mapMutations(['setScrollContainerRef']),
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
    position: relative;
    flex-grow: 1;
    align-self: flex-start;
    height: 100%;
    max-height: 100%;
  }

  &__content-container {
    height: 100%;
    max-height: 100%;
    padding: 0 80px 48px 80px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  &__content {
    width: 100%;
    max-width: 900px;
    padding-top: 105px;
    margin: auto;
  }
}
</style>
