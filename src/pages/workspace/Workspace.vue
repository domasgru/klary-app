<template>
  <div class="workspace">
    <Header />
    <div class="container">
      <Sidebar class="workspace__sidebar" />
      <router-view class="workspace__main" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { logout } from '@/firebase';
import Header from './WorkspaceHeader.vue';
import Sidebar from './WorkspaceSidebar.vue';

export default {
  components: {
    Header,
    Sidebar,
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
  width: 100%;
  min-height: 100%;
  padding-bottom: 80px;
  overflow: hidden;
  background: $grey-100;

  &__sidebar {
    width: 200px;
    margin-right: 8.54%;
  }

  &__main {
    flex-grow: 1;
  }
}

.container {
  display: flex;
  width: 100%;
  max-width: $container;
  height: 100%;
  padding: $container-padding;
  padding-top: 80px;
  margin: auto;
}
</style>
