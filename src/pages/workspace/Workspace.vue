<template>
  <div class="workspace">
    <Header />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { logout } from '@/firebase';
import Header from './WorkspaceHeader.vue';

export default {
  components: {
    Header,
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
  background: $grey-100;
}

.container {
  width: 100%;
  max-width: 1234px;
  height: 100%;
  padding: 0 32px;
  padding-top: 80px;
  margin: auto;
}
</style>
