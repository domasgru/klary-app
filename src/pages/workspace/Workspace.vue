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
  <MobileDisclaimerFullscreen />
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { logout } from '@/firebase';
import MobileDisclaimerFullscreen from '@/pages/MobileDisclaimerFullscreen.vue';
import Sidebar from './WorkspaceSidebar.vue';
import WorkspaceTopbar from './WorkspaceTopbar.vue';

export default {
  components: {
    Sidebar,
    WorkspaceTopbar,
    MobileDisclaimerFullscreen,
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
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-self: flex-start;
    height: 100%;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  &__content-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: min-content;
    padding: 0 80px 64px 80px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    max-width: 788px;
    padding-top: 48px;
    margin: auto;
  }
}
</style>
